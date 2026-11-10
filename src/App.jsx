// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { RequireAuth, RedirectIfAuthed, RequireRole } from "@components/guards";
import AppShell from "@components/AppShell";

// Part 0:
import Landing from "@pages/Landing";
import NotFound from "@pages/NotFound";

// Part 1:
import Login from "@pages/auth/Login";
import Signup from "@pages/auth/Signup";

// Part 2:
import Payments from "@pages/Payments";
import Invoices from "@pages/Invoices";
import Reports from "@pages/Reports";
import AdminDashboard from "@pages/admin/AdminDashboard";
import AdminFinancials from "@pages/admin/AdminFinancials";
import AdminReports from "@pages/admin/AdminReports";
import AdminUsers from "@pages/admin/AdminUsers";

// Part 3:
import TutorDashboard from "@pages/TutorDashboard";


// Part 4:
// import Tutors from "@pages/Tutors";
// import TutorPublicPage from "@pages/TutorPublicPage";

// Part 5:
// import StudentDashboard from "@pages/StudentDashboard";
// import Profile from "@pages/Profile";
// import Notifications from "@pages/Notifications";
// import SessionDetail from "@pages/SessionDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route path="/" element={<Landing />} />

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/payments" element={<Payments />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/reports" element={<Reports />} />

              {/* <Route element={<RequireRole allow={["admin"]} />}> */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/financials" element={<AdminFinancials />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              {/* </Route> */}

              <Route path="/tutor" element={<TutorDashboard />} />

              
              {/* <Route path="/tutors" element={<Tutors />} /> */}
              {/* <Route path="/tutors/:id" element={<TutorPublicPage />} /> */}

              {/* <Route path="/student" element={<StudentDashboard />} /> */}
              {/* <Route path="/sessions/:id" element={<SessionDetail />} /> */}
              {/* <Route path="/notifications" element={<Notifications />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
