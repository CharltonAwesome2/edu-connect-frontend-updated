import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck2, DollarSign, Star } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { tutorProfiles, bookingRequests, tutoringSessions, availability, tutorReviews } from "@api";
import { Loading, PageHeader, StatCard } from "@components/ui";
import TutorStats from "./dashboard/tutor/TutorStats";
import BookingRequests from "./dashboard/tutor/BookingRequests";
import UpcomingSessions from "./dashboard/tutor/UpcomingSessions";
import AvailabilityManager from "./dashboard/tutor/AvailabilityManager";
import EarningsSummary from "./dashboard/tutor/EarningsSummary";
import TutorReviewsList from "./dashboard/tutor/TutorReviewsList";

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
      const pid = prof.tutorProfileId;
      const [reqs, sess, av, rev, avg] = await Promise.all([
        bookingRequests.byTutorProfileId(pid).catch(() => []),
        tutoringSessions.byTutorProfileId(pid).catch(() => []),
        availability.byTutorProfileId(pid).catch(() => []),
        tutorReviews.byTutorId(pid).catch(() => []),
        tutorReviews.averageRating({ tutorProfileId: pid }).catch(() => 0),
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

  useEffect(() => {
    void load();
  }, [load]);

  const pending = requests.filter((r) => r.status === "PENDING");
  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.startTime) >= new Date() && s.status !== "CANCELLED")
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [sessions],
  );

  const handleRequest = async (request, status) => {
    try {
      await bookingRequests.updateStatus(request.bookingRequestId, status);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSlotToggle = async (slot) => {
    try {
      await availability.update({ ...slot, isAvailable: !slot.isAvailable });
      await load();
    } catch (e) {
      setError(e.message);
    }
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

      <TutorStats
        pendingCount={pending.length}
        upcomingCount={upcoming.length}
        avgRating={avgRating}
        reviewCount={reviews.length}
      />

      {tab === "overview" && (
        <div className="dashboard-grid">
          <UpcomingSessions sessions={upcoming} />
          <BookingRequests requests={pending} onAction={handleRequest} compact />
        </div>
      )}

      {tab === "requests" && <BookingRequests requests={requests} onAction={handleRequest} />}

      {tab === "sessions" && <UpcomingSessions sessions={sessions} title="All sessions" />}

      {tab === "availability" && <AvailabilityManager slots={slots} onToggle={handleSlotToggle} />}

      {tab === "reviews" && <TutorReviewsList reviews={reviews} />}

      {tab === "overview" && <EarningsSummary sessions={sessions} />}
    </>
  );
}
