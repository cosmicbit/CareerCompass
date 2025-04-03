# Node.js + MongoDB Backend

A simple backend setup using **Node.js**, **Express**, and **MongoDB**.

## 🛠️ Requirements

- **Arch Linux** (or any Linux distro)
- **Node.js & npm** (Install via `sudo pacman -S nodejs npm`)
- **MongoDB** (Install via `yay -S mongodb-bin` or `paru -S mongodb-bin`)

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-repo/node-mongo-backend.git
cd node-mongo-backend

2️⃣ Install Dependencies

npm install

3️⃣ Configure Environment Variables

Create a .env file and add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_secret_key

4️⃣ Start MongoDB (if not running)

sudo systemctl start mongod


Production Mode

npm start
