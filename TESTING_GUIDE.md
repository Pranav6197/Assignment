# API Testing Guide

## Prerequisites
1. Server is running: `npm run dev`
2. MongoDB Atlas is connected
3. Postman is installed (or use the collection file)

---

## Test Sequence

### **Step 1: Create Users**

#### Test 1.1: Create Admin User
**Request:**
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

**Expected Response (201):**
```json
{
  "_id": "694e9fc4f665ac0d91e3dfa6",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "createdAt": "2025-12-26T14:46:28.176Z",
  "__v": 0
}
```
**✅ Copy the `_id` - you'll need it for events!**

---

#### Test 1.2: Create Member User
**Request:**
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "member"
}
```

**Expected Response (201):** Similar to above with different `_id`

**✅ Copy this `_id` too!**

---

#### Test 1.3: Duplicate Email (Should Fail)
**Request:**
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Alice Duplicate",
  "email": "alice@example.com",
  "role": "member"
}
```

**Expected Response (400):**
```json
{
  "message": "User already exists"
}
```

---

#### Test 1.4: Get All Users
**Request:**
```
GET http://localhost:3000/users
```

**Expected Response (200):**
```json
[
  {
    "_id": "694e9fc4f665ac0d91e3dfa6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2025-12-26T14:46:28.176Z",
    "__v": 0
  },
  {
    "_id": "694e9fc4f665ac0d91e3dfa7",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "member",
    "createdAt": "2025-12-26T14:47:15.234Z",
    "__v": 0
  }
]
```

---

### **Step 2: Create Events**

**⚠️ IMPORTANT: Replace `REPLACE_WITH_ACTUAL_USER_ID` with the actual user `_id` from Step 1!**

#### Test 2.1: Login Event
**Request:**
```
POST http://localhost:3000/events
Content-Type: application/json

{
  "userId": "694e9fc4f665ac0d91e3dfa6",
  "eventType": "login",
  "metadata": {
    "ip": "192.168.1.1"
  }
}
```

**Expected Response (201):**
```json
{
  "_id": "694ea1b2f665ac0d91e3dfa8",
  "userId": "694e9fc4f665ac0d91e3dfa6",
  "eventType": "login",
  "metadata": {
    "ip": "192.168.1.1"
  },
  "createdAt": "2025-12-26T14:50:12.456Z",
  "__v": 0
}
```

---

#### Test 2.2: Create Multiple Events
Create at least 10-15 events with different types:
- `login` (create 3-4)
- `logout` (create 2-3)
- `file_upload` (create 2-3)
- `file_download` (create 2-3)

Use different user IDs and metadata for variety.

---

#### Test 2.3: Invalid User ID (Should Fail)
**Request:**
```
POST http://localhost:3000/events
Content-Type: application/json

{
  "userId": "invalid_id_123",
  "eventType": "login",
  "metadata": {
    "ip": "10.0.0.1"
  }
}
```

**Expected Response (400):**
```json
{
  "message": "Invalid User ID"
}
```

---

#### Test 2.4: Invalid Event Type (Should Fail)
**Request:**
```
POST http://localhost:3000/events
Content-Type: application/json

{
  "userId": "REPLACE_WITH_ACTUAL_USER_ID",
  "eventType": "invalid_type",
  "metadata": {}
}
```

**Expected Response (500/400):**
```json
{
  "message": "Event validation failed: eventType: `invalid_type` is not a valid enum value for path `eventType`."
}
```

---

### **Step 3: Query Events**

#### Test 3.1: Get All Events
**Request:**
```
GET http://localhost:3000/events
```

**Expected Response (200):** Array of all events

---

#### Test 3.2: Filter by Event Type
**Request:**
```
GET http://localhost:3000/events?eventType=login
```

**Expected Response (200):** Only login events

---

#### Test 3.3: Filter by User ID
**Request:**
```
GET http://localhost:3000/events?userId=694e9fc4f665ac0d91e3dfa6
```

**Expected Response (200):** Only events for that user

---

#### Test 3.4: Filter by Date Range
**Request:**
```
GET http://localhost:3000/events?startTime=2025-12-26&endTime=2025-12-27
```

**Expected Response (200):** Events within date range

---

#### Test 3.5: Multiple Filters
**Request:**
```
GET http://localhost:3000/events?eventType=login&startTime=2025-12-26
```

**Expected Response (200):** Login events after start date

---

### **Step 4: Analytics (Aggregation)**

#### Test 4.1: Events Summary
**Request:**
```
GET http://localhost:3000/analytics/events-summary
```

**Expected Response (200):**
```json
{
  "login": 4,
  "logout": 3,
  "file_upload": 3,
  "file_download": 2
}
```

**✅ Verify:** Counts match the events you created

---

#### Test 4.2: User Activity Report
**Request:**
```
GET http://localhost:3000/analytics/user-activity
```

**Expected Response (200):**
```json
[
  {
    "userId": "694e9fc4f665ac0d91e3dfa6",
    "userName": "John Doe",
    "totalEvents": 8,
    "lastEventAt": "2025-12-26T15:20:30.123Z"
  },
  {
    "userId": "694e9fc4f665ac0d91e3dfa7",
    "userName": "Alice Johnson",
    "totalEvents": 4,
    "lastEventAt": "2025-12-26T15:15:22.456Z"
  }
]
```

**✅ Verify:**
- User names are populated (from `$lookup`)
- Total events match actual count
- Last event timestamp is correct

---

## How to Import Postman Collection

1. Open Postman
2. Click **Import** (top left)
3. Select **File** → Choose `postman_collection.json`
4. Click **Import**
5. You'll see "User Event Tracking & Analytics API" collection
6. **IMPORTANT:** Update all `REPLACE_WITH_ACTUAL_USER_ID` placeholders with real user IDs

---

## Verification Checklist

- [ ] All users created successfully
- [ ] Duplicate email validation works
- [ ] Events created with valid user IDs
- [ ] Invalid user ID rejected
- [ ] Event filters work (type, user, date)
- [ ] Events summary shows correct counts
- [ ] User activity report includes user names
- [ ] Data visible in MongoDB Atlas under `assignment1` database
- [ ] Collections `users` and `events` exist in Atlas

---

## Common Issues

### Issue: "User already exists"
**Solution:** Use a different email address

### Issue: "Invalid User ID"
**Solution:** Copy the actual `_id` from the user creation response

### Issue: Empty analytics results
**Solution:** Create more events first (at least 5-10)

### Issue: Data not in Atlas
**Solution:** 
1. Check `.env` has correct `MONGO_URI`
2. Verify database name is `assignment1` in the URI
3. Restart server: `Ctrl+C` then `npm run dev`
