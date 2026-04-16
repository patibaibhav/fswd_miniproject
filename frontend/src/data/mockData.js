// Employee data
export const employees = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    salary: 85000,
    status: "Active",
    joiningDate: "2022-01-15",
  },
  {
    id: "EMP002",
    name: "Sarah Smith",
    email: "sarah.smith@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    salary: 75000,
    status: "Active",
    joiningDate: "2021-06-20",
  },
  {
    id: "EMP003",
    name: "Michael Johnson",
    email: "michael.johnson@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: 80000,
    status: "Active",
    joiningDate: "2022-03-10",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "HR",
    position: "HR Manager",
    salary: 70000,
    status: "Active",
    joiningDate: "2020-09-01",
  },
  {
    id: "EMP005",
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Finance",
    position: "Accountant",
    salary: 65000,
    status: "Active",
    joiningDate: "2023-02-14",
  },
  {
    id: "EMP006",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    department: "Engineering",
    position: "Junior Developer",
    salary: 55000,
    status: "Active",
    joiningDate: "2023-07-01",
  },
  {
    id: "EMP007",
    name: "Robert Brown",
    email: "robert.brown@company.com",
    department: "Sales",
    position: "Sales Executive",
    salary: 60000,
    status: "Inactive",
    joiningDate: "2021-11-05",
  },
  {
    id: "EMP008",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@company.com",
    department: "Marketing",
    position: "Content Writer",
    salary: 50000,
    status: "Active",
    joiningDate: "2023-01-20",
  },
];

// Attendance data
export const attendance = employees.map((emp) => ({
  employeeId: emp.id,
  employeeName: emp.name,
  totalDays: 22,
  present: 20 + Math.floor(Math.random() * 3),
  absent: Math.floor(Math.random() * 2),
  leave: Math.floor(Math.random() * 2),
}));

// Salary breakdown data
export const salaryData = employees.map((emp) => {
  const basicSalary = emp.salary;
  const allowances = Math.round(basicSalary * 0.2);
  const deductions = Math.round(basicSalary * 0.1);
  const grossSalary = basicSalary + allowances;
  const netSalary = grossSalary - deductions;

  return {
    employeeId: emp.id,
    employeeName: emp.name,
    basicSalary,
    allowances,
    deductions,
    grossSalary,
    netSalary,
  };
});

// Payslip data
export const payslips = employees.map((emp) => {
  const salary = salaryData.find((s) => s.employeeId === emp.id);
  return {
    ...salary,
    month: "March",
    year: 2026,
    department: emp.department,
    position: emp.position,
  };
});

// Monthly expenses chart data
export const monthlyExpenses = [
  { month: "Sep", amount: 520000 },
  { month: "Oct", amount: 540000 },
  { month: "Nov", amount: 535000 },
  { month: "Dec", amount: 550000 },
  { month: "Jan", amount: 545000 },
  { month: "Feb", amount: 540000 },
  { month: "Mar", amount: 535000 },
];

// Department expenses chart data
export const departmentExpenses = [
  { department: "Engineering", amount: 220000 },
  { department: "Marketing", amount: 125000 },
  { department: "HR", amount: 70000 },
  { department: "Finance", amount: 65000 },
  { department: "Sales", amount: 60000 },
];
