# User Event Tracking & Analytics Service

A backend service built with **Node.js**, **TypeScript**, and **MongoDB** for managing users, tracking events, and providing analytics using aggregation pipelines.

---

## 📋 Features

- **User Management**: Create and retrieve users with role-based access (admin/member)
- **Event Tracking**: Record user-generated events (login, logout, file_upload, file_download)
- **Analytics**: MongoDB aggregation pipelines for event summaries and user activity reports
- **TypeScript**: Full type safety and modern development experience
- **MongoDB Atlas**: Cloud-based database integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Postman (for testing)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Assignment1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Update `.env` file with your MongoDB Atlas connection string:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/assignment1?retryWrites=true&w=majority
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Verify connection:**
   You should see:
   ```
   Server running on port 3000
   MongoDB Connected: cluster0-shard-00-01.xxxxx.mongodb.net
   ```

---

## 📁 Project Structure

```
Assignment1/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection logic
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   └── Event.ts             # Event schema
│   ├── controllers/
│   │   ├── userController.ts    # User business logic
│   │   ├── eventController.ts   # Event business logic
│   │   └── analyticsController.ts # Analytics aggregation logic
│   ├── routes/
│   │   ├── userRoutes.ts        # User endpoints
│   │   ├── eventRoutes.ts       # Event endpoints
│   │   └── analyticsRoutes.ts   # Analytics endpoints
│   └── app.ts                   # Main application entry point
├── dist/                        # Compiled JavaScript (after build)
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── postman_collection.json      # Postman test collection
└── TESTING_GUIDE.md             # Detailed testing instructions
```

---

## 🔌 API Endpoints

### **Users**

#### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

#### Get All Users
```http
GET /users
```

---

### **Events**

#### Create Event
```http
POST /events
Content-Type: application/json

{
  "userId": "694e9fc4f665ac0d91e3dfa6",
  "eventType": "login",
  "metadata": {
    "ip": "192.168.1.1"
  }
}
```

#### Get Events (with optional filters)
```http
GET /events?eventType=login&userId=694e9fc4f665ac0d91e3dfa6&startTime=2024-01-01&endTime=2024-12-31
```

**Query Parameters:**
- `userId` - Filter by user ID
- `eventType` - Filter by event type (login, logout, file_upload, file_download)
- `startTime` - Filter events after this date
- `endTime` - Filter events before this date

---

### **Analytics**

#### Events Summary
```http
GET /analytics/events-summary
```

**Response:**
```json
{
  "login": 120,
  "logout": 80,
  "file_upload": 45,
  "file_download": 70
}
```

#### User Activity Report
```http
GET /analytics/user-activity
```

**Response:**
```json
[
  {
    "userId": "694e9fc4f665ac0d91e3dfa6",
    "userName": "John Doe",
    "totalEvents": 25,
    "lastEventAt": "2025-12-26T10:20:30Z"
  }
]
```

---

## 🧪 Testing

### Using Postman Collection

1. Import `postman_collection.json` into Postman
2. Follow the test sequence in `TESTING_GUIDE.md`
3. Replace `REPLACE_WITH_ACTUAL_USER_ID` with real user IDs

### Manual Testing

See `TESTING_GUIDE.md` for detailed step-by-step testing instructions with expected responses.

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server with hot-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled production build
```

---

## 📊 Data Models

### User Schema
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  role: 'admin' | 'member',
  createdAt: Date
}
```

### Event Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  eventType: string,
  metadata: object (optional),
  createdAt: Date
}
```

---

## 🔍 MongoDB Aggregation Pipelines

### Events Summary
Uses `$group` to count events by type:
```javascript
Event.aggregate([
  { $group: { _id: '$eventType', count: { $sum: 1 } } }
])
```

### User Activity Report
Uses `$lookup`, `$group`, and `$max`:
```javascript
Event.aggregate([
  { $group: { _id: '$userId', totalEvents: { $sum: 1 }, lastEventAt: { $max: '$createdAt' } } },
  { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
  { $unwind: '$user' },
  { $project: { userId: '$_id', userName: '$user.name', totalEvents: 1, lastEventAt: 1 } }
])
```

---

## ⚠️ Important Notes

1. **Database Name**: Ensure your MongoDB URI includes `/assignment1` to store data in the correct database
2. **User IDs**: Always use valid MongoDB ObjectIds when creating events
3. **Email Uniqueness**: User emails must be unique
4. **Event Types**: Supported types are `login`, `logout`, `file_upload`, `file_download`

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify MongoDB connection string in `.env`
- Ensure all dependencies are installed: `npm install`

### Data not appearing in Atlas
- Verify database name in connection string is `assignment1`
- Check if server shows "MongoDB Connected" message
- Restart server after changing `.env`

### "Invalid User ID" error
- Ensure you're using a valid MongoDB ObjectId
- Copy the `_id` from a user creation response

---

## 📝 Assignment Requirements Met

✅ User Management (Create, Retrieve)  
✅ Event Tracking with metadata  
✅ Event filtering (userId, eventType, date range)  
✅ Analytics using MongoDB aggregation  
✅ Events Summary with `$group`  
✅ User Activity Report with `$lookup`, `$group`, `$max`  
✅ TypeScript implementation  
✅ Clean code structure  
✅ API design best practices  

---

## 👨‍💻 Author

**Pranav Bhawari**  
VIT University

---

## 📄 License

ISC
