import { CalendarCheck2, Clock, DollarSign, Star } from "lucide-react";
import { StatCard } from "@components/ui";

export default function TutorStats({ pendingCount, upcomingCount, avgRating, reviewCount }) {
  return (
    <section className="stats-grid">
      <StatCard icon={<Clock />} label="Pending requests" value={pendingCount} tone="amber" />
      <StatCard icon={<CalendarCheck2 />} label="Upcoming sessions" value={upcomingCount} tone="cyan" />
      <StatCard icon={<Star />} label="Average rating" value={avgRating ? avgRating.toFixed(1) : "—"} tone="violet" />
      <StatCard icon={<DollarSign />} label="Total reviews" value={reviewCount} tone="green" />
    </section>
  );
}
