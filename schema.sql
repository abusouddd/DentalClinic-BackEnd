CREATE TABLE Admin (
    AdminID SERIAL PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);

CREATE TABLE Doctor (
    DoctorID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    Photo TEXT
);

CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);

CREATE TABLE Appointment (
    AppointmentID SERIAL PRIMARY KEY,
    Service TEXT NOT NULL,
    Date TEXT NOT NULL,
    Time TEXT NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE,

    DoctorID INTEGER NOT NULL,
    AdminID INTEGER NOT NULL,

    CONSTRAINT fk_doctor
        FOREIGN KEY (DoctorID)
        REFERENCES Doctor(DoctorID)
        ON DELETE CASCADE,

    CONSTRAINT fk_admin_appointment
        FOREIGN KEY (AdminID)
        REFERENCES Admin(AdminID)
        ON DELETE CASCADE
);

CREATE TABLE BookedAppointment (
    BookedAppointmentID SERIAL PRIMARY KEY,

    PatientName TEXT NOT NULL,
    PatientPhone TEXT NOT NULL,
    PatientEmail TEXT NOT NULL,
    Service TEXT NOT NULL,
    Notes TEXT,
    Status TEXT,
    IsCancelled BOOLEAN DEFAULT FALSE,

    AppointmentID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    AdminID INTEGER NOT NULL,

    CONSTRAINT fk_appointment
        FOREIGN KEY (AppointmentID)
        REFERENCES Appointment(AppointmentID)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (UserID)
        REFERENCES "User"(UserID)
        ON DELETE CASCADE,

    CONSTRAINT fk_admin_booking
        FOREIGN KEY (AdminID)
        REFERENCES Admin(AdminID)
        ON DELETE CASCADE
);

