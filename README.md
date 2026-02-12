Frontend – HRMS Lite

The frontend is built using React and connects to the FastAPI backend.
It provides a clean interface to manage employees and track daily attendance.

------------------------------------------------------------

TECH STACK

- React 18
- Axios (API communication)
- CSS3 (custom styling)
- MUI (Material UI components)
- MUI Icons
- MUI Date Pickers (with Dayjs)
- SweetAlert2 (alerts & confirmations)

------------------------------------------------------------

DEPENDENCIES USED

Core UI Packages:

npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-date-pickers dayjs
npm install sweetalert2

------------------------------------------------------------

LOCAL SETUP

1. Navigate to frontend folder

cd frontend

2. Install dependencies

npm install

3. Create .env file and add:

REACT_APP_API_URL=http://localhost:8000

4. Start development server

npm start

Application runs at:
http://localhost:3000

------------------------------------------------------------

DEPLOYMENT

The frontend is deployed on Vercel.

To deploy:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variable:

REACT_APP_API_URL=<your-backend-url>

4. Deploy

Production build command:
npm run build

------------------------------------------------------------

FEATURES

- Add and delete employees
- Mark attendance (Present / Absent)
- Filter attendance by employee and date
- Attendance summary with percentage
- Dashboard with statistics
- Form validation
- Confirmation dialogs before delete
- Responsive layout

------------------------------------------------------------

UI DETAILS

- Built using Material UI components
- MUI Icons used across dashboard and actions
- Date selection handled using MUI Date Picker + Dayjs
- SweetAlert2 used for alerts
- Responsive design for desktop and mobile

------------------------------------------------------------


Note:
This frontend is designed for demo purposes and works with a single admin user (no authentication implemented).

