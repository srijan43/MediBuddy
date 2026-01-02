<b>Problem Statement Number:- CBP17</b>

<h1><b>Problem Title:- <em>Personalized Healthcare Recommendation System</em></b></h1>

We are a team of 4 members, we choose the topic Personalized Healthcare Recommendation System,
where we created a full-stack healthcare platform with AI-driven healthcare recommendation system that analyzes individual health data, preferences, and medical history to provide personalized treatment plans, preventive care suggestions, and lifestyle recommendations for improved health outcomes.

# Medibuddy - Intelligent Healthcare Platform

A full-stack healthcare platform that analyzes patient symptoms and medical history to provide personalized health recommendations and specialist referrals, streamlining patient triage.

## Features

- **Symptom Analysis**: Intelligent analysis of patient symptoms with AI-powered recommendations
- **Specialist Referrals**: Smart matching to appropriate medical specialists based on symptoms
- **Patient Records Management**: Secure storage and management of patient medical history
- **Doctor Profiles**: Comprehensive doctor profiles with specializations, ratings, and availability
- **Appointment Scheduling**: Easy booking and management of medical appointments
- **Health Insights Dashboard**: Visual analytics and personalized health recommendations
- **Authentication**: Secure user authentication for both patients and doctors

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization

## Project Structure

```
hackaton/
├── backend/
│   ├── models/
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── MedicalRecord.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── symptoms.js
│   │   ├── appointments.js
│   │   └── recommendations.js
│   └── middleware/
│       └── auth.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── public/
├── server.js
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/medibuddy
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

3. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Running Both Servers

From the root directory, you can run both servers concurrently:
```bash
npm run dev:all
```

## API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register a new patient
- `POST /api/auth/register/doctor` - Register a new doctor
- `POST /api/auth/login/patient` - Patient login
- `POST /api/auth/login/doctor` - Doctor login

### Patients
- `GET /api/patients/profile` - Get patient profile (authenticated)
- `PUT /api/patients/profile` - Update patient profile (authenticated)
- `POST /api/patients/symptoms` - Add symptom (authenticated)
- `GET /api/patients/symptoms` - Get patient symptoms (authenticated)

### Doctors
- `GET /api/doctors` - Get all doctors (optional query: ?specialization=)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/profile/me` - Get doctor profile (authenticated)

### Symptoms
- `POST /api/symptoms/analyze` - Analyze symptoms and get recommendations (authenticated)
- `GET /api/symptoms/history` - Get symptom analysis history (authenticated)

### Appointments
- `POST /api/appointments` - Book appointment (authenticated)
- `GET /api/appointments/patient` - Get patient appointments (authenticated)
- `GET /api/appointments/doctor` - Get doctor appointments (authenticated)
- `PUT /api/appointments/:id` - Update appointment (authenticated)
- `DELETE /api/appointments/:id` - Cancel appointment (authenticated)

### Recommendations
- `GET /api/recommendations/personalized` - Get personalized health recommendations (authenticated)
- `POST /api/recommendations/specialists` - Get specialist recommendations based on symptoms (authenticated)

## Usage

1. **Register/Login**: Create an account as a patient or doctor
2. **Symptom Analysis**: Enter your symptoms to get AI-powered analysis and recommendations
3. **View Recommendations**: Get personalized health recommendations based on your profile
4. **Book Appointments**: Browse doctors and schedule appointments
5. **Health Dashboard**: View your health insights and track your wellness journey

## MongoDB Schema

### Patient
- Personal information (username, email, age, gender)
- Medical history
- Symptoms log
- Appointments reference

### Doctor
- Professional information (name, specialization, qualifications)
- Experience and ratings
- Availability schedule
- Consultation fee

### Appointment
- Patient and doctor references
- Date, time, and reason
- Status tracking
- Diagnosis and prescription

### Medical Record
- Comprehensive patient records
- Vital signs and lab results
- Medications and recommendations

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation
- Secure data storage

## Future Enhancements

- Real-time chat with doctors
- Telemedicine video consultations
- Prescription management
- Lab test result integration
- Mobile app development
- Advanced AI/ML models for better recommendations

## License

This project is created for hackathon purposes.
