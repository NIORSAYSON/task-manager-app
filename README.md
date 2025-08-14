# Task Manager

A modern, full-stack task management application built with Next.js and Express.js, featuring user authentication, task organization, and both list and Kanban board views.

**Developed by Nestor B. Sayson Jr.**

## 🌟 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Multiple Views**: Switch between List view and Kanban board view
- **Task Organization**:
  - Three status columns: "To Do", "In Progress", "Done"
  - Priority levels: Low, Medium, High
  - Due date tracking
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant task updates across the application
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Zustand** - State management
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NIORSAYSON/task-manager-app.git
   cd task-manager-app
   ```

2. **Set up the backend**

   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

1. **Backend Environment Variables**

   Create a `.env` file in the `server/src` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

2. **Frontend Environment Variables**

   Create a `.env.local` file in the `client` directory:

   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

   The server will run on `http://localhost:5000`

2. **Start the frontend application**
   ```bash
   cd client
   npm run dev
   ```
   The application will run on `http://localhost:3000`

## 📱 How to Use

### 1. **Account Creation**

- Navigate to the registration page
- Create an account with your name, email, and password
- Or use the test account: `test@gmail.com` / `test123`

### 2. **Dashboard Overview**

- Upon login, you'll see the main dashboard
- Use the sidebar to navigate between different views
- Toggle between List view and Kanban board view

### 3. **Managing Tasks**

#### Creating Tasks

- Click the "Add Task" button
- Fill in task details:
  - **Title**: Required task name
  - **Description**: Optional detailed description
  - **Status**: To Do, In Progress, or Done
  - **Priority**: Low, Medium, or High
  - **Due Date**: Optional deadline

#### Editing Tasks

- Click on any task to view details
- Use the edit button to modify task information
- Changes are saved automatically

#### Organizing Tasks

- **List View**: See all tasks in a structured list format
- **Kanban View**: Drag and drop tasks between status columns
- Filter and sort tasks by priority or due date

### 4. **Task Status Workflow**

- **To Do**: Newly created or planned tasks
- **In Progress**: Tasks currently being worked on
- **Done**: Completed tasks

## 🔧 API Endpoints

### Authentication

- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login

### Tasks

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

### Debug (Development)

- `GET /debug` - Server status and debugging information

## 🏗️ Development

### Frontend Development

```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Backend Development

```bash
cd server
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server
```

## 🎨 UI Components

The application uses a modern component-based architecture with:

- **Custom UI Components**: Built with Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components
- **Dark Mode Ready**: Infrastructure for theme switching

## 📊 State Management

- **Zustand Stores**:
  - `taskStore`: Manages task data and operations
  - `dashboardStore`: Handles user state and UI preferences
  - `modalStore`: Controls modal visibility and state

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management

## 🌐 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## 📝 License

This project is created by **Nestor B. Sayson Jr.** for educational and portfolio purposes.

## 🤝 Contributing

This is a personal project, but if you have suggestions or find bugs, feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

**Nestor B. Sayson Jr.**

- Email: nessayson@gmail.com
- LinkedIn: https://www.linkedin.com/in/nestor-sayson-b8671b292
- GitHub: https://github.com/NIORSAYSON

---
