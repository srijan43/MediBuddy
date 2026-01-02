# Troubleshooting Guide

## Common Errors and Solutions

### 1. "Cannot find module" or "Module not found" Error

**Solution:**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. MongoDB Connection Error

**Error:** `MongoDB connection error: connect ECONNREFUSED`

**Solutions:**
- **Option A:** Start MongoDB locally
  ```bash
  # Windows (if installed as service, it should auto-start)
  # Or manually start MongoDB service
  net start MongoDB
  
  # Or if MongoDB is in your PATH:
  mongod
  ```

- **Option B:** Use MongoDB Atlas (Cloud)
  - Create a free account at https://www.mongodb.com/cloud/atlas
  - Get your connection string
  - Update `.env` file:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medibuddy
    ```

- **Option C:** Skip MongoDB for now (will show connection error but server will still start)
  - The server will start but API calls requiring database will fail
  - You can test the frontend independently

### 3. Port Already in Use Error

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
- Change the port in `.env` file:
  ```
  PORT=5001
  ```
- Or kill the process using port 5000:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### 4. React Scripts Not Found

**Error:** `'react-scripts' is not recognized`

**Solution:**
```bash
cd client
npm install
```

### 5. CORS Error in Browser

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Ensure backend is running on port 5000
- Check that `REACT_APP_API_URL` in `client/.env` matches backend URL
- Verify CORS is enabled in `server.js` (should be `app.use(cors())`)

### 6. "Cannot read property" or Undefined Errors

**Solution:**
- Check that all environment variables are set
- Verify API endpoints are correct
- Check browser console for specific error messages

### 7. Tailwind CSS Not Working

**Error:** Styles not applying

**Solution:**
- Ensure `tailwind.config.js` exists in `client/` directory
- Check that `postcss.config.js` exists
- Verify `index.css` imports Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 8. JWT Token Errors

**Error:** `Token is not valid` or authentication failures

**Solution:**
- Clear browser localStorage:
  ```javascript
  localStorage.clear()
  ```
- Log out and log back in
- Check that JWT_SECRET is set in `.env`

## Step-by-Step Debugging

### 1. Check if all files exist:
```bash
# Backend files
ls backend/models/
ls backend/routes/
ls backend/middleware/

# Frontend files
ls client/src/components/
ls client/src/pages/
```

### 2. Verify dependencies:
```bash
# Check backend
npm list --depth=0

# Check frontend
cd client
npm list --depth=0
```

### 3. Test backend independently:
```bash
# Start only backend
npm start

# Test in another terminal
curl http://localhost:5000/api/health
```

### 4. Test frontend independently:
```bash
cd client
npm start
# Should open http://localhost:3000
```

## Quick Fix Commands

```bash
# Complete reinstall
rm -rf node_modules package-lock.json
npm install
cd client
rm -rf node_modules package-lock.json
npm install
cd ..

# Clear npm cache
npm cache clean --force

# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version
```

## Getting Help

If you're still experiencing issues:

1. **Check the exact error message** - Copy the full error from terminal
2. **Check which command failed** - Was it `npm install`, `npm start`, or something else?
3. **Check Node.js version** - Run `node --version` (should be 14 or higher)
4. **Check if MongoDB is running** - Try connecting with MongoDB Compass or CLI

## Common Windows-Specific Issues

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Path Issues
If commands aren't found:
- Ensure Node.js is in your PATH
- Restart terminal after installing Node.js

