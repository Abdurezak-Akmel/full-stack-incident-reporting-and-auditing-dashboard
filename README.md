# Incident Reporting and Auditing Portal

A modern, full-stack incident reporting and management system built with React, Node.js, and PostgreSQL. Features a sleek dark UI, real-time updates, role-based access control, and comprehensive incident management capabilities.

## 🌟 Features

### 🔐 User Management

- **Role-based Authentication**: Users and Admins with different access levels
- **Admin Invite System**: Secure admin registration with invite codes
- **Email Verification**: OTP-based account verification
- **Password Security**: Bcrypt hashing with strength validation

### 📊 Incident Management

- **Real-time Updates**: Live status synchronization across all dashboards
- **Incident Preview**: Detailed modal views for all incidents
- **Status Tracking**: Pending, Resolved, and Rejected status management
- **Filtering & Search**: Advanced filtering by user and status

### 🎨 Modern UI/UX

- **Dark Theme**: Professional dark interface with gradient backgrounds
- **Responsive Design**: Mobile-friendly layout
- **Glass Morphism**: Modern frosted glass effects
- **Smooth Animations**: Micro-interactions and transitions
- **Tailwind CSS**: Utility-first styling framework

### 🚀 Technical Features

- **Real-time Polling**: Automatic data refresh every 10 seconds
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured backend endpoints
- **Database Optimization**: Indexed queries and triggers
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Inter Font**: Professional typography

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **UUID**: Primary key generation
- **Bcrypt**: Password hashing
- **JWT**: Authentication tokens
- **Nodemailer**: Email service

### Development

- **Vite**: Fast development server
- **Nodemon**: Auto-restart for backend
- **ESLint**: Code linting

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-incident-reporting-and-audting-portal
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb incident_portal

# Run the database schema
psql -d incident_portal -f database_schema.sql
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/incident_portal
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 5. Start the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory, in new terminal)
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 🗄️ Database Schema

### Users Table

- `id`: UUID primary key
- `full_name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: 'user' or 'admin'
- `is_verified`: Email verification status
- `otp_code`: One-time password for verification
- `registration_code`: Admin invite code
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Incidents Table

- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `title`: Incident title
- `description`: Detailed incident description
- `contact`: Contact information
- `status`: 'pending', 'resolved', or 'rejected'
- `created_at`: Incident creation timestamp
- `updated_at`: Last update timestamp

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify email with OTP
- `POST /api/auth/forgot-password` - Reset password request
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/send-admin-code` - Send admin invite code

### Incidents

- `GET /api/incidents/my` - Get current user's incidents
- `GET /api/incidents/all` - Get all incidents (admin only)
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident status (admin only)

## 👥 User Roles

### Regular Users

- Submit new incidents
- View their own incidents
- Track incident status
- Receive real-time updates

### Administrators

- All user permissions
- View all incidents from all users
- Update incident status (resolve/reject)
- Send admin invite codes
- Access admin dashboard with statistics

## 🎨 UI Components

### Login/Register Pages

- Modern dark theme with gradient backgrounds
- Form validation and error handling
- Password strength indicator
- Role selection for registration

### User Dashboard

- Personal incident statistics
- Incident submission form
- Real-time incident list
- Incident preview modals
- Logout functionality

### Admin Dashboard

- System-wide incident statistics
- Advanced filtering options
- Incident management table
- Admin invite functionality
- Bulk status updates

## 🔧 Configuration

### Environment Variables

- `PORT`: Backend server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: SMTP email address
- `EMAIL_PASS`: SMTP app password

### Default Admin Account

- **Email**: admin@incident.com
- **Password**: admin123
- **Role**: Admin
- **Status**: Pre-verified

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set secure production values
2. **Database**: Use production PostgreSQL instance
3. **Email Service**: Configure SMTP with proper credentials
4. **HTTPS**: Enable SSL/TLS for production
5. **CORS**: Configure allowed origins
6. **Rate Limiting**: Implement API rate limiting
7. **Logging**: Set up application logging

### Docker Deployment (Optional)

```dockerfile
# Add Dockerfile configuration here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

**Email Not Sending**

- Verify SMTP credentials
- Check app password (not regular password)
- Ensure less secure apps is enabled for Gmail

**CORS Issues**

- Verify frontend URL in CORS settings
- Check API endpoint URLs in frontend

**Real-time Updates Not Working**

- Verify polling interval
- Check network requests in browser dev tools
- Ensure JWT token is valid

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check existing issues for solutions
- Review documentation thoroughly

---

**Built with ❤️ for modern incident management**
