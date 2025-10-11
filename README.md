## Simple Chat Application

- Case study as well as project repo for Database Managament(23CSE202) build using **CockroachDB**.A simple real-time chat application built with FastAPI, WebSocket, and PostgreSQL/CockroachDB. Users are assigned random usernames and can send and receive messages in a chat room, with messages persisted in a database.

## Features
- **Real-time Messaging**: Utilizes WebSocket for instant message broadcasting.
- **Random Usernames**: Automatically generates unique usernames (e.g., SneakyPenguin123).
- **Persistent Storage**: Stores messages in a PostgreSQL or CockroachDB database.
- **Responsive UI**: Clean, terminal-inspired interface with distinct styling for sent and received messages.
- **Message History**: Loads the last 20 messages on connection.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dharshan2208/chat-app
   cd chat-app
   ```

2. **Install Dependencies**
   ```bash
   pip install fastapi uvicorn psycopg2-binary python-dotenv
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=disable
   ```
   Replace `<user>`, `<password>`, `<host>`, `<port>`, and `<database>` with your database credentials.

4. **Initialize the Database**
   Run the database initialization script to create the required tables:
   ```bash
   python -c "from models import init_db; init_db()"
   ```

5. **Run the Application**
   Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the Chat App**
   Open `http://localhost:8000/static/index.html` in a browser. If the static files are not served correctly, ensure the `static` directory contains `index.html`, `style.css`, and `script.js`.

## Usage
- Open the app in multiple browser tabs to simulate multiple users.
- Type a message in the input field and press "Send" or hit Enter.
- Messages are displayed with the sender's username and timestamp, styled differently for the current user vs. others.
- The chat automatically scrolls to the latest message.

## Advantages of CockroachDB Over Other Databases

CockroachDB is a distributed SQL database designed for scalability, resilience, and consistency. Here are some key advantages over other databases like PostgreSQL, MySQL, or MongoDB:

1. **Distributed Architecture**:
   - CockroachDB is designed to run across multiple nodes, providing automatic sharding and replication. This ensures high availability and fault tolerance, unlike traditional single-node databases like MySQL or PostgreSQL.
   - It can handle node failures without downtime, making it ideal for applications requiring continuous uptime.

2. **Horizontal Scalability**:
   - CockroachDB scales horizontally by adding nodes, distributing data automatically. This contrasts with PostgreSQL, which often requires manual sharding or replication setups for scaling.
   - It supports seamless scaling without application changes, unlike MongoDB, which may require careful shard key design.

3. **Strong Consistency**:
   - CockroachDB provides strong consistency (ACID transactions) across distributed nodes, unlike many NoSQL databases (e.g., MongoDB) that may sacrifice consistency for performance.
   - It ensures serializable isolation, preventing anomalies in concurrent transactions, which is critical for applications like chat systems.

4. **Geo-Distributed Deployment**:
   - CockroachDB supports geo-partitioning, allowing data to be pinned to specific regions for low-latency access. This is particularly useful for global applications, unlike PostgreSQL, which requires additional tools for multi-region setups.
   - It handles cross-region replication transparently, reducing latency for users in different locations.

5. **PostgreSQL Compatibility**:
   - CockroachDB is wire-compatible with PostgreSQL, allowing existing tools (e.g., `psycopg2`) and queries to work with minimal changes, as seen in this project.
   - This makes it easier to migrate from PostgreSQL without rewriting application code, unlike transitioning to NoSQL databases.

6. **Built-in Resilience**:
   - CockroachDB automatically rebalances data and repairs inconsistencies, reducing operational overhead compared to MySQL or PostgreSQL, which may require manual intervention for failover or recovery.
   - It survives data center outages by replicating data across multiple regions.

7. **Simplified Operations**:
   - CockroachDB’s self-healing nature and built-in monitoring reduce the need for dedicated database administrators, unlike traditional RDBMS systems that often require complex tuning and maintenance.

## Notes
- The app assumes a database is running and accessible via the `DATABASE_URL`. For CockroachDB, ensure the cluster is initialized and the `DATABASE_URL` points to a valid node.
- The WebSocket connection may need a stable network to avoid disconnections.
- For production, consider securing the WebSocket endpoint and adding user authentication.

## Contributors
- [Arham Garg](https://github.com/arhamgarg)
- [A Adithyan](https://github.com/Cirutuu)
- [S S Naveen](https://github.com/Naveen77qwerty)
- [Vishnu Girish](https://github.com/Vishnu-Girish)
- [H Dharshan](https://github.com/Dharshan2208)
