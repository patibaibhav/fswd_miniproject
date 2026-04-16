import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import SalaryCalculation from './pages/SalaryCalculation';
import PayslipGeneration from './pages/PayslipGeneration';
import Reports from './pages/Reports';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="payroll" element={<SalaryCalculation />} />
          <Route path="payslips" element={<PayslipGeneration />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/employee" element={<DashboardLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="payslips" element={<PayslipGeneration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
