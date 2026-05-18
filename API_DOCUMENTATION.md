# API Documentation — Smart Leads Dashboard

Base URL: `http://localhost:5000/api`

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Description",
  "data": { }
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

---

## Authentication

### Register

`POST /auth/register`

**Body:**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "sales"
}
```

> First registered user is automatically assigned `admin` role.

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "admin" },
    "token": "jwt_token_here"
  }
}
```

---

### Login

`POST /auth/login`

**Body:**

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

---

### Get Current User

`GET /auth/me` 🔒

**Response:** `200 OK`

---

## Leads

### List Leads (with filters & pagination)

`GET /leads` 🔒

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |
| `search` | string | Search name or email |
| `sort` | string | `latest` or `oldest` |

**Example:**

```
GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "items": [ /* lead objects */ ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 25,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Single Lead

`GET /leads/:id` 🔒

**Response:** `200 OK`

---

### Create Lead

`POST /leads` 🔒

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "status": "New",
  "source": "Website"
}
```

**Response:** `201 Created`

---

### Update Lead

`PUT /leads/:id` 🔒

**Body:** (all fields optional)

```json
{
  "status": "Contacted"
}
```

**Response:** `200 OK`

---

### Delete Lead

`DELETE /leads/:id` 🔒 **Admin only**

**Response:** `200 OK`

---

### Export Leads CSV

`GET /leads/export/csv` 🔒

Supports same query filters as list (except `page`).

**Example:**

```
GET /leads/export/csv?status=Qualified&source=Instagram&search=Rahul&sort=latest
```

**Response:** `200 OK` — `text/csv` file download

---

## Health Check

`GET /api/health`

```json
{ "success": true, "message": "Smart Leads API is running" }
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden (RBAC) |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 500 | Server error |

---

## Role-Based Access

| Action | Admin | Sales |
|--------|-------|-------|
| View leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Update lead | ✅ | ✅ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

---

## Postman / cURL Examples

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"rahul@example.com\",\"password\":\"password123\"}"
```

### Get leads with filters

```bash
curl "http://localhost:5000/api/leads?status=Qualified&search=Rahul&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
