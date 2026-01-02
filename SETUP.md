# Setup Guide for Medibuddy Healthcare Platform

## Quick Start

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/medibuddy
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB locally:

```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# Or start manually:
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### 5. Run the Application

#### Option A: Run Both Servers Separately

Terminal 1 - Backend:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

#### Option B: Run Both Servers Together

From the root directory:
```bash
npm run dev:all
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Testing the Application

1. **Register as a Patient**:
   - Go to http://localhost:3000/register
   - Select "Patient" as user type
   - Fill in the registration form
   - Submit to create account

2. **Register as a Doctor** (optional):
   - Go to http://localhost:3000/register
   - Select "Doctor" as user type
   - Fill in professional details
   - Submit to create account

3. **Login**:
   - Go to http://localhost:3000/login
   - Enter your credentials
   - Select appropriate user type

4. **Use Features**:
   - **Symptom Analysis**: Navigate to "Symptom Analysis" and enter symptoms
   - **Health Insights**: View personalized recommendations
   - **Book Appointments**: Browse doctors and schedule appointments
   - **Dashboard**: View your health summary

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":
- Ensure MongoDB is installed and running
- Check if the connection string in `.env` is correct
- For cloud MongoDB (MongoDB Atlas), update `MONGODB_URI` with your connection string

### Port Already in Use

If port 5000 or 3000 is already in use:
- Change `PORT` in `.env` for backend
- React will automatically suggest an alternative port for frontend

### CORS Issues

If you encounter CORS errors:
- Ensure the backend is running on the correct port
- Check that `REACT_APP_API_URL` in client `.env` matches the backend URL

### Module Not Found Errors

If you see module not found errors:
- Run `npm install` in both root and client directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Database Schema

The application uses MongoDB with the following collections:
- `patients` - Patient records and medical history
- `doctors` - Doctor profiles and availability
- `appointments` - Appointment bookings
- `medicalrecords` - Comprehensive medical records

## API Testing

You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register patient
curl -X POST http://localhost:5000/api/auth/register/patient \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","age":25,"gender":"Male"}'
```

## Production Deployment

For production deployment:

1. Set secure environment variables
2. Use a production MongoDB instance
3. Build the React app: `cd client && npm run build`
4. Serve the built files using a production server (nginx, etc.)
5. Use process managers like PM2 for Node.js
6. Enable HTTPS
7. Set up proper security headers

## Support

For issues or questions, refer to the main README.md file.

