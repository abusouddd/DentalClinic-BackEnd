# 🦷 Dental Clinic Backend API

This project is the **backend server** for a Dental Clinic Appointment Management System.  
It is built using **Node.js**, **Express**, and **PostgreSQL**, and provides APIs for user authentication, doctor listing, appointment scheduling, and booking management.

The backend is designed to be used with a frontend application (React or any client) and follows a RESTful API structure.

---

## 📌 Features

- User signup and login
- Admin login
- Doctor listing
- Admin appointment slot creation
- View available appointments
- Book appointments
- Admin approval or rejection of bookings
- User view of personal bookings

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- CORS
- Morgan (logging)
- dotenv

---

## 📁 Project Structure

DentalClinic-BackEnd/
│
├── server.js # Main server file
├── db.js # PostgreSQL database connection
├── .env # Environment variables
│
├── middleware/
│ └── adminAuth.js # Admin authorization middleware
│
├── routes/
│ ├── auth.js # User & admin authentication routes
│ ├── doctors.js # Doctors routes
│ ├── appointments.js # Appointment slots routes
│ └── bookings.js # Booking routes
│
└── package.json


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd DentalClinic-BackEnd

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File
Create a file named .env in the root folder and add:
DATABASE_URL=postgresql://username:password@localhost:5432/dental_clinic
PORT=5000
Replace:
username → your PostgreSQL username
password → your PostgreSQL password
dental_clinic → your database name

4️⃣ Run the Server
npm start

🔐 Authentication Notes
Admin Authorization

Some routes require admin access.

You must send the following header:
x-admin-id: <AdminID>
Example:
x-admin-id: 1

📡 API Endpoints Overview
🔑 Authentication
| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/auth/signup`      | User signup         |
| POST   | `/api/auth/login`       | User login          |
| PUT    | `/api/auth/update`      | Update user profile |
| POST   | `/api/auth/admin/login` | Admin login         |

👨‍⚕️ Doctors
| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | `/api/doctors` | Get all doctors |

📅 Appointments
| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/appointments`           | Create appointment slot (Admin) |
| GET    | `/api/appointments/available` | Get available slots             |

📖 Bookings
| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| POST   | `/api/bookings`              | Book an appointment           |
| GET    | `/api/bookings`              | Get all bookings (Admin)      |
| PATCH  | `/api/bookings/:id/status`   | Update booking status (Admin) |
| DELETE | `/api/bookings/:id`          | Delete booking                |
| GET    | `/api/bookings/user/:userId` | User bookings                 |

🔄 Booking Flow (How It Works)
Admin creates appointment slots.
Users view available appointments.
User books an appointment.
Appointment becomes unavailable.
Admin approves or rejects the booking.
If rejected, the appointment becomes available again.

⚠️ Important Notes

Passwords are stored in plain text (for academic use only).
Admin authentication is simplified using headers.
PostgreSQL must be running before starting the server.
Database tables must already exist.

📌 Future Improvements

Add password hashing (bcrypt)
Use JWT authentication
Use PostgreSQL transactions for booking
Protect delete booking route
Add role-based access control

👨‍🎓 Author
This backend was developed as part of the Hussen Technical University project for a Dental Clinic Management System.

📄 License
This project is for educational purposes only.