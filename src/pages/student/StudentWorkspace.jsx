
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentWorkspace } from "../../api";

function formatDate(value) {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date not available";

    return date.toLocaleString("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getStatusClass(status) {
    return String(status || "UNKNOWN").toLowerCase().replaceAll("_", "-");
}

export default function StudentWorkspace() {
    const { user } = useAuth();

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadWorkspace() {
            if (!user?.userId) {
                setError("Your student account could not be identified.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await studentWorkspace.byStudentId(user.userId);
                setWorkspace(data);
            } catch (err) {
                setError(err.message || "Unable to load your Student Workspace.");
            } finally {
                setLoading(false);
            }
        }

        loadWorkspace();
    }, [user?.userId]);

    if (loading) {
        return <main className="dashboard-page">
            <p>Loading your Student Workspace...</p>
        </main>;
    }

    if (error) {
        return <main className="dashboard-page">
            <h1>Student Workspace</h1>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
                Try Again
            </button>
        </main>;
    }

    const sessions = workspace?.tutoringSessions || [];
    const bookings = workspace?.bookingRequests || [];
    const notifications = workspace?.notifications || [];
    const payments = workspace?.payments || [];
    const invoices = workspace?.invoices || [];
    const reviews = workspace?.tutorReviews || [];

    const upcomingSessions = sessions
        .filter((session) => {
            const date = new Date(session.startTime);
            return !Number.isNaN(date.getTime()) &&
                date >= new Date() &&
                !["CANCELLED", "COMPLETED"].includes(
                    String(session.status).toUpperCase()
                );
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const studentName =
        workspace?.student?.firstName ||
        user?.firstName ||
        user?.name ||
        "Student";

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">STUDENT PORTAL</p>
                    <h1>Welcome back, {studentName}!</h1>
                    <p>Here's an overview of your learning activity.</p>
                </div>
            </header>

            <section className="stats-grid">
                <article className="stat-card">
                    <div className="stat-icon">📚</div>
                    <h3>My Sessions</h3>
                    <p className="stat-value">{sessions.length}</p>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">📝</div>
                    <h3>Booking Requests</h3>
                    <p className="stat-value">{bookings.length}</p>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">🔔</div>
                    <h3>Unread Notifications</h3>
                    <p className="stat-value">
                        {workspace?.unreadNotificationCount ?? 0}
                    </p>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <h3>Tutor Reviews</h3>
                    <p className="stat-value">{reviews.length}</p>
                </article>
            </section>

            <section className="dashboard-grid">
                <article className="panel">
                    <h2>Upcoming Sessions</h2>

                    {upcomingSessions.length === 0 ? (
                        <p>No upcoming tutoring sessions.</p>
                    ) : (
                        <div className="session-list">
                            {upcomingSessions.map((session) => (
                                <div
                                    className="session-row"
                                    key={session.tutoringSessionId}
                                >
                                    <div className="session-info">
                                        <h3>
                                            {session.subject?.name || "Tutoring Session"}
                                        </h3>
                                        <p>{formatDate(session.startTime)}</p>
                                        <p>
                                            Tutor: {session.tutorProfile?.user?.firstName || "Assigned tutor"}
                                        </p>
                                    </div>

                                    <span className={`status ${getStatusClass(session.status)}`}>
                                        {session.status || "Scheduled"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="panel">
                    <h2>Booking Requests</h2>

                    {bookings.length === 0 ? (
                        <p>You don't have any booking requests yet.</p>
                    ) : (
                        <div className="compact-list">
                            {bookings.map((booking) => (
                                <div
                                    className="compact-list-item"
                                    key={booking.bookingRequestId}
                                >
                                    <div>
                                        <h3>
                                            {booking.subject?.name || "Subject"}
                                        </h3>
                                        <p>{formatDate(booking.requestedStartTime)}</p>
                                    </div>

                                    <span className={`status ${getStatusClass(booking.status)}`}>
                                        {booking.status || "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="panel">
                    <h2>Recent Notifications</h2>

                    {notifications.length === 0 ? (
                        <p>You're all caught up!</p>
                    ) : (
                        <div className="compact-list">
                            {notifications.slice(0, 5).map((notification) => (
                                <div
                                    className="compact-list-item"
                                    key={notification.notificationId}
                                >
                                    <div>
                                        <h3>{notification.title || "Notification"}</h3>
                                        <p>{notification.message || "You have a new update."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="panel">
                    <h2>My Account Overview</h2>

                    <div className="detail-list">
                        <p>Payments: <strong>{payments.length}</strong></p>
                        <p>Invoices: <strong>{invoices.length}</strong></p>
                        <p>Reviews submitted: <strong>{reviews.length}</strong></p>
                    </div>
                </article>
            </section>
        </main>
    );
}
