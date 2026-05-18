# MongoDB Atlas Setup — Smart Leads Dashboard

This guide explains how to connect the project to **MongoDB Atlas** (cloud database), and how **collections** and **entities** work in this app.

> **Note:** MongoDB does not use SQL-style **tables**. It uses **collections** (like tables) and **documents** (like rows). In this project, **entities** are defined as **Mongoose schemas** in TypeScript.

---

## Part 1: Create MongoDB Atlas Account & Cluster

### Step 1 — Sign up

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google
3. Choose the **free** tier (M0 Sandbox) when prompted

### Step 2 — Create a cluster

1. Click **Build a Database** → **M0 FREE**
2. Cloud provider: **AWS** (or any)
3. Region: choose closest to you (e.g. `Mumbai / ap-south-1`)
4. Cluster name: `SmartLeadsCluster` (or default)
5. Click **Create**

Wait 1–3 minutes until the cluster status is **Active**.

### Step 3 — Create database user

1. Go to **Database Access** (left sidebar) → **Add New Database User**
2. Authentication: **Password**
3. Username: `smartleads_user` (example)
4. Password: generate a strong password and **save it**
5. Privileges: **Read and write to any database**
6. Click **Add User**

### Step 4 — Allow network access

1. Go to **Network Access** → **Add IP Address**
2. For local development, click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - For production, use only your server IP
3. Click **Confirm**

### Step 5 — Get connection string

1. Go to **Database** → click **Connect** on your cluster
2. Choose **Drivers** → **Node.js** → version 5.5 or later
3. Copy the connection string. It looks like:

```
mongodb+srv://smartleads_user:<password>@smartleadscluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. Replace `<password>` with your real password (URL-encode special characters if needed, e.g. `@` → `%40`)

5. Add your **database name** before `?`:

```
mongodb+srv://smartleads_user:YOUR_PASSWORD@smartleadscluster.xxxxx.mongodb.net/smart_leads_db?retryWrites=true&w=majority
```

---

## Part 2: Connect This Project to Atlas

### Update `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://smartleads_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smart_leads_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Start the backend

```bash
cd backend
npm install
npm run dev
```

You should see:

```
MongoDB connected successfully
Server running on port 5000
```

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** → Register → Create leads from the UI.

---

## Part 3: Collections vs Tables vs Entities

| SQL term | MongoDB term | In this project |
|----------|--------------|-----------------|
| Database | Database | `smart_leads_db` |
| Table | **Collection** | `users`, `leads` |
| Row | **Document** | One user or one lead JSON object |
| Column | **Field** | `name`, `email`, `status`, etc. |
| Table schema | **Entity / Schema** | `User.ts`, `Lead.ts` (Mongoose) |

**You do not manually create collections in Atlas** for this app. Mongoose creates them automatically when you:

- Register a user → document inserted into `users`
- Create a lead → document inserted into `leads`

---

## Part 4: Entity Definitions (Schemas)

Entities live in `backend/src/models/`.

### Entity 1: User (`users` collection)

**File:** `backend/src/models/User.ts`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Max 100 chars |
| `email` | String | Yes | Unique, lowercase |
| `password` | String | Yes | Bcrypt hashed, hidden in queries |
| `role` | String | Yes | `admin` or `sales` |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Example document in Atlas:**

```json
{
  "_id": { "$oid": "665f1a2b3c4d5e6f7a8b9c0d" },
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "$2a$12$hashed...",
  "role": "admin",
  "createdAt": { "$date": "2026-05-17T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-05-17T10:00:00.000Z" }
}
```

---

### Entity 2: Lead (`leads` collection)

**File:** `backend/src/models/Lead.ts`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Max 150 chars |
| `email` | String | Yes | Valid email |
| `status` | String | Yes | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | String | Yes | `Website`, `Instagram`, `Referral` |
| `createdBy` | ObjectId | Yes | References `users._id` |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

**Example document:**

```json
{
  "_id": { "$oid": "665f1a2b3c4d5e6f7a8b9c0e" },
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "Qualified",
  "source": "Instagram",
  "createdBy": { "$oid": "665f1a2b3c4d5e6f7a8b9c0d" },
  "createdAt": { "$date": "2026-05-17T11:00:00.000Z" },
  "updatedAt": { "$date": "2026-05-17T11:00:00.000Z" }
}
```

---

## Part 5: View Data in Atlas UI

1. Open [Atlas](https://cloud.mongodb.com) → **Database** → **Browse Collections**
2. Select database: **`smart_leads_db`**
3. After you register/login in the app, you will see:
   - **`users`** — registered accounts
   - **`leads`** — lead records

### Insert a document manually (optional)

1. Click **Add My Own Data** (first time) or **Create Collection**
2. Database: `smart_leads_db`
3. Collection: `leads`
4. Click **Insert Document** → paste JSON (use a valid `createdBy` user `_id` from `users`)

---

## Part 6: Useful Atlas / MongoDB Queries

In Atlas: **Browse Collections** → select collection → **Filter** tab, or use **mongosh**:

```bash
mongosh "mongodb+srv://smartleads_user:PASSWORD@cluster0.xxxxx.mongodb.net/smart_leads_db"
```

### Users

```javascript
// All users (without password field in app queries)
db.users.find({}, { name: 1, email: 1, role: 1, createdAt: 1 })

// Admin users only
db.users.find({ role: "admin" })
```

### Leads

```javascript
// All leads, newest first
db.leads.find().sort({ createdAt: -1 })

// Filter: Qualified + Instagram
db.leads.find({ status: "Qualified", source: "Instagram" })

// Search name or email
db.leads.find({
  $or: [
    { name: { $regex: "Rahul", $options: "i" } },
    { email: { $regex: "Rahul", $options: "i" } }
  ]
})

// Count by status
db.leads.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

### Indexes (created by the app)

```javascript
db.leads.getIndexes()
db.users.getIndexes()
```

---

## Part 7: Seed Sample Data (Optional)

Run the seed script after Atlas is connected:

```bash
cd backend
npm run seed
```

This creates:

- 1 admin user: `admin@smartleads.com` / `admin123`
- 1 sales user: `sales@smartleads.com` / `sales123`
- 5 sample leads

---

## Part 8: How to Add a New Entity (Collection)

Example: add a `notes` entity for lead comments.

### 1. Create model file `backend/src/models/Note.ts`

```typescript
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  leadId: Types.ObjectId;
  text: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    text: { type: String, required: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', noteSchema);
```

Mongoose will create collection **`notes`** automatically on first insert.

### 2. Add controller, routes, validators (same pattern as `Lead`)

### 3. Restart backend — collection appears in Atlas after first API call

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `bad auth` | Wrong username/password in connection string |
| `IP not whitelisted` | Add your IP in Atlas → Network Access |
| `ENOTFOUND` | Check cluster URL spelling |
| Password has `@`, `#` | URL-encode: `@` → `%40`, `#` → `%23` |
| No collections visible | Register a user or run `npm run seed` |
| Connection timeout | Check internet / firewall |

---

## Quick Reference

| Item | Value |
|------|--------|
| Database name | `smart_leads_db` |
| Collections | `users`, `leads` |
| User entity | `backend/src/models/User.ts` |
| Lead entity | `backend/src/models/Lead.ts` |
| Connection env | `MONGODB_URI` in `backend/.env` |

For local MongoDB (non-Atlas), see **[MONGODB_SETUP.md](./MONGODB_SETUP.md)**.
