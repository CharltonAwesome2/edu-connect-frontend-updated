import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2, CheckCircle2, Clock, DollarSign, Star, XCircle,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { tutorProfiles, bookingRequests, tutoringSessions,
         availability, tutorReviews } from "@api";
import {
  Card, EmptyState, Loading, PageHeader, StatCard, StatusBadge,
  formatDate, money,
} from "@components/ui";

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
const TABS = ["overview", "requests", "sessions", "availability", "reviews"];

export default function TutorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError("");
    try {
      const prof = await tutorProfiles.byUserId(user.userId);
      setProfile(prof);
      const [reqs, sess, av, rev, avg] = await Promise.all([
        bookingRequests.byTutorProfileId(prof.tutorProfileId).catch(() => []),
        tutoringSessions.byTutorProfileId(prof.tutorProfileId).catch(() => []),
        availability.byTutorProfileId(prof.tutorProfileId).catch(() => []),
        tutorReviews.byTutorId(prof.tutorProfileId).catch(() => []),
        tutorReviews.averageRating({ tutorProfileId: prof.tutorProfileId }).catch(() => 0),
      ]);
      setRequests(reqs ?? []);
      setSessions(sess ?? []);
      setSlots(av ?? []);
      setReviews(rev ?? []);
      setAvgRating(Number(avg) || 0);
    } catch (e) {
      setError(e.message || "Failed to load tutor workspace");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => { void load(); }, [load]);

  const pending = requests.filter((r) => r.status === "PENDING");
  const upcoming = useMemo(
    () => sessions
      .filter((s) => new Date(s.startTime) >= new Date() && s.status !== "CANCELLED")
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [sessions],
  );

  const handleRequest = async (request, status) => {
    try {
      await bookingRequests.updateStatus(request.bookingRequestId, status);
      await load();
    } catch (e) { setError(e.message); }
  };

  const handleSlotToggle = async (slot) => {
    try {
      await availability.update({ ...slot, isAvailable: !slot.isAvailable });
      await load();
    } catch (e) { setError(e.message); }
  };

  if (loading) return <Loading label="Loading tutor workspace" />;

  return (
    <>
      <PageHeader
        eyebrow="Tutor workspace"
        title={`Welcome, ${user?.name || "Tutor"}`}
        description="Manage booking requests, availability, sessions and reviews."
      />

      {error && <div className="notice notice-error">{error}</div>}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <section className="stats-grid">
        <StatCard icon={<Clock />} label="Pending requests" value={pending.length} tone="amber" />
        <StatCard icon={<CalendarCheck2 />} label="Upcoming sessions" value={upcoming.length} tone="cyan" />
        <StatCard icon={<Star />} label="Average rating" value={avgRating ? avgRating.toFixed(1) : "—"} tone="violet" />
        <StatCard icon={<DollarSign />} label="Total reviews" value={reviews.length} tone="green" />
      </section>

      {tab === "overview" && (
        <div className="dashboard-grid">
          <Card className="span-two">
            <div className="card-heading">
              <div>
                <span className="eyebrow">Next up</span>
                <h2>Upcoming sessions</h2>
              </div>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState title="No upcoming sessions" text="Accepted requests will appear here." />
            ) : (
              <div className="session-list">
                {upcoming.slice(0, 5).map((s) => (
                  <SessionRow key={s.tutoringSessionId} session={s} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="card-heading">
              <div><span className="eyebrow">Requests</span><h2>Pending</h2></div>
            </div>
            <RequestsList requests={pending.slice(0, 5)} onAction={handleRequest} compact />
          </Card>
        </div>
      )}

      {tab === "requests" && (
        <Card>
          <div className="card-heading"><h2>All booking requests</h2></div>
          <RequestsList requests={requests} onAction={handleRequest} />
        </Card>
      )}

      {tab === "sessions" && (
        <Card>
          <div className="card-heading"><h2>All sessions</h2></div>
          <div className="session-list">
            {sessions.length === 0 ? (
              <EmptyState title="No sessions yet" text="Sessions will appear once requests are accepted." />
            ) : sessions.map((s) => <SessionRow key={s.tutoringSessionId} session={s} />)}
          </div>
        </Card>
      )}

      {tab === "availability" && (
        <Card>
          <div className="card-heading"><h2>Weekly availability</h2></div>
          <div className="subject-chips">
            {slots.length === 0 ? (
              <EmptyState title="No availability set" text="Add slots to start receiving requests." />
            ) : slots.map((slot) => (
              <div key={slot.availabilityId} className="availability-slot-row">
                <button
                  className={`availability-slot ${slot.isAvailable ? "selected" : ""}`}
                  onClick={() => handleSlotToggle(slot)}
                >
                  <b>{slot.dayOfWeek}</b>
                  <span>{slot.startTime} – {slot.endTime}</span>
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "reviews" && (
        <Card>
          <div className="card-heading"><h2>Student reviews</h2></div>
          {reviews.length === 0 ? (
            <EmptyState title="No reviews yet" text="Reviews appear after completed sessions." />
          ) : (
            <div className="review-list">
              {reviews.map((r) => (
                <blockquote key={r.tutorReviewId}>
                  <div>{"★".repeat(r.rating)}</div>
                  <p>{r.comment || "No comment"}</p>
                  <small>{formatDate(r.createdAt)}</small>
                </blockquote>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}

function SessionRow({ session }) {
  const d = new Date(session.startTime);
  return (
    <div className="session-row">
      <div className="date-tile">
        <b>{d.getDate()}</b>
        <span>{d.toLocaleString("en", { month: "short" })}</span>
      </div>
      <div className="session-info">
        <h3>{session.subject?.subjectName || "Tutoring session"}</h3>
        <p>{formatDate(session.startTime)} · {money(session.amount)}</p>
      </div>
      <StatusBadge status={session.status} />
    </div>
  );
}

function RequestsList({ requests, onAction, compact = false }) {
  if (requests.length === 0) {
    return <EmptyState title="Nothing here" text="No booking requests to show." />;
  }
  return (
    <div className="request-list">
      {requests.map((r) => (
        <article key={r.bookingRequestId}>
          <span className="request-icon"><CalendarCheck2 size={16} /></span>
          <div>
            <h3>{r.subject?.subjectName || "Session request"}</h3>
            <p>{formatDate(r.preferredStartTime)} · {money(r.offeredAmount)}</p>
            {!compact && <small>Student: {r.student?.name || r.studentId}</small>}
          </div>
          <StatusBadge status={r.status} />
          {r.status === "PENDING" && (
            <div className="request-actions">
              <button className="button button-success" onClick={() => onAction(r, "ACCEPTED")}>
                <CheckCircle2 size={14} /> Accept
              </button>
              <button className="button button-danger" onClick={() => onAction(r, "DECLINED")}>
                <XCircle size={14} /> Decline
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
