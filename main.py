from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from database import get_conn
from models import init_db
from fastapi.staticfiles import StaticFiles
import json

app = FastAPI()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Initialize DB
init_db()

# Store active WebSocket connections
connected_clients = set()


class User(BaseModel):
    username: str


class Message(BaseModel):
    username: str
    content: str

@app.get("/")
async def read_root():
    return {"message": "Hello, Server is running."}


@app.post("/users/")
async def create_user(user: User):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username) VALUES (%s) RETURNING id",
                (user.username,),
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            return {"id": user_id, "username": user.username}
    except Exception:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            username = msg["username"]
            content = msg["content"]

            # Save message to database
            conn = get_conn()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM users WHERE username = %s", (username,))
                    user = cur.fetchone()
                    if not user:
                        raise HTTPException(status_code=404, detail="User not found")
                    cur.execute(
                        "INSERT INTO messages (user_id, content) VALUES (%s, %s)",
                        (user[0], content),
                    )
                    conn.commit()
            finally:
                conn.close()

            # Broadcast message to all connected clients
            message = {
                "username": username,
                "content": content,
                "created_at": json.dumps({"__datetime__": True}, default=str),
            }
            for client in connected_clients:
                await client.send_text(json.dumps(message))
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
    except Exception as e:
        print(f"Error: {e}")
        connected_clients.remove(websocket)


@app.get("/messages/")
async def get_messages():
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.username, m.content, m.created_at
                FROM messages m
                JOIN users u ON m.user_id = u.id
                ORDER BY m.created_at DESC
            """)
            rows = cur.fetchall()
        return [{"username": r[0], "content": r[1], "created_at": r[2]} for r in rows]
    finally:
        conn.close()
