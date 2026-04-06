# Finance Dashboard Backend API

A secure REST API for a finance dashboard system with role-based access control (RBAC), JWT authentication, and financial data management.

## 📌 Features

- **Authentication & Authorization** – JWT-based authentication with role-based access control
- **User Management** – Create, read, update, and delete users with roles (Admin, Analyst, Viewer)
- **Transaction Management** – Full CRUD operations for financial records
- **Dashboard Analytics** – Aggregated data including total income, expenses, net balance, and category-wise totals
- **Input Validation** – Proper validation for all API inputs
- **Error Handling** – Meaningful error messages with appropriate HTTP status codes
- **SQLite Database** – Lightweight, file-based database (no separate server required)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| SQLite3 | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |

## 📁 Project Structure

```
finance-dashboard-backend/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── transactionController.js
│   └── userController.js
├── middleware/           # Authentication & authorization
│   ├── auth.js
│   └── roleCheck.js
├── models/              # Data schemas
│   ├── Transaction.js
│   └── User.js
├── routes/              # API endpoints
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── transactionRoutes.js
│   └── userRoutes.js
├── services/            # Business logic
│   ├── dashboardServices.js
│   └── transactionServices.js
├── utils/               # Helper functions
│   ├── errorHandler.js
│   └── validation.js
├── data/                # SQLite database (auto-created)
├── .env                 # Environment variables
├── server.js            # Application entry point
└── package.json         # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/finance-dashboard-backend.git
cd finance-dashboard-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
Create a `.env` file in the root directory:
```env
JWT_SECRET=your_super_secret_key_change_this
PORT=3000
```

4. **Start the server**
```bash
node server.js
```

You should see:
```
Sample data added successfully

Test Logins:
   Admin:    admin@test.com / password123
   Analyst:  analyst@test.com / password123
   Viewer:   viewer@test.com / password123

Server running on http://localhost:3000
```

## 🔐 Test Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@test.com | password123 | Full access (CRUD users & transactions) |
| **Analyst** | analyst@test.com | password123 | View transactions + dashboard analytics |
| **Viewer** | viewer@test.com | password123 | View transactions only |

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login user | Public |

**Login Request Body:**
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin",
    "status": "active"
  }
}
```

### Transactions

All transaction endpoints require authentication. Add token to header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/transactions` | Get all transactions | All authenticated users |
| GET | `/transactions?type=income` | Filter by type | All authenticated users |
| GET | `/transactions?category=Food` | Filter by category | All authenticated users |
| GET | `/transactions?startDate=2026-03-01&endDate=2026-03-31` | Filter by date range | All authenticated users |
| POST | `/transactions` | Create transaction | Admin only |
| PUT | `/transactions/:id` | Update transaction | Admin only |
| DELETE | `/transactions/:id` | Delete transaction | Admin only |

**Create/Update Transaction Body:**
```json
{
  "amount": 1500,
  "type": "expense",
  "category": "Shopping",
  "date": "2026-04-06",
  "description": "New shoes"
}
```

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/summary` | Get dashboard analytics | Analyst, Admin |

**Dashboard Response:**
```json
{
  "totalIncome": 5300,
  "totalExpenses": 1950,
  "netBalance": 3350,
  "categoryTotals": [
    {
      "category": "Salary",
      "type": "income",
      "total": 5000
    },
    {
      "category": "Rent",
      "type": "expense",
      "total": 1000
    }
  ],
  "recentTransactions": [...]
}
```

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

**Create User Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "viewer",
  "status": "active"
}
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if server is running |

## 🔒 Role-Based Access Control

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View transactions | ✅ | ✅ | ✅ |
| View dashboard summary | ❌ | ✅ | ✅ |
| Create transaction | ❌ | ❌ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | User's full name |
| email | TEXT | Unique email |
| password | TEXT | Hashed password |
| role | TEXT | viewer/analyst/admin |
| status | TEXT | active/inactive |
| created_at | DATETIME | Timestamp |

### Transactions Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| amount | REAL | Transaction amount |
| type | TEXT | income/expense |
| category | TEXT | Category name |
| date | DATE | Transaction date |
| description | TEXT | Optional notes |
| created_at | DATETIME | Timestamp |

## 🧪 Testing with Thunder Client / Postman

1. Start the server: `node server.js`
2. Login to get token: `POST /api/auth/login`
3. Copy the token from response
4. Add header to subsequent requests:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## ❌ Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 500 | Server error |

**Error Response Format:**
```json
{
  "error": "Description of the error"
}
```

## 📝 Assumptions Made

1. Users are created by admin only (no public registration)
2. Transactions are linked to the user who created them
3. Admin can view and manage all users and transactions
4. Analysts can view all transactions but cannot modify them
5. Viewers can only view their own transactions
6. Dashboard summaries are real-time (no caching)
7. Date format is YYYY-MM-DD

## 🔜 Possible Enhancements

- Pagination for transactions list
- Soft delete functionality
- Rate limiting
- Unit tests
- API documentation with Swagger
- Email notifications
- Password reset feature
- Refresh tokens

## 👨‍💻 Author

Submitted for Backend Developer Intern assignment

## 📅 Date

April 2026

