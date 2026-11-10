            <h2>{tutorName}</h2>
            <p>{profile.bio || "Add a short biography to introduce yourself to students."}</p>
            <div className="tw-profile-tags">
              <span><GraduationCap size={14} /> Tutor</span>
              <span><ShieldCheck size={14} /> {profile.isVerified ? "Verified tutor" : "Verification pending"}</span>
              <span><Clock3 size={14} /> {profile.yearsExperience || 0} years experience</span>
            </div>
          </div>
          <div className="tw-rate"><strong>{profile.hourlyRate != null ? `R${Number(profile.hourlyRate).toFixed(2)}` : "—"}</strong><span>per hour</span></div>
        </section>

        <section className="tw-stats-grid">
          <StatCard icon={CalendarDays} label="Upcoming sessions" value={upcomingSessions.length} detail="Scheduled sessions" />
          <StatCard icon={Users} label="Pending requests" value={pendingCount} detail="Need your attention" />
          <StatCard icon={BookOpen} label="Subjects offered" value={subjects.length} detail="Linked to your profile" />
          <StatCard icon={GraduationCap} label="Tutor rating" value={profileRating ? profileRating.toFixed(1) : "—"} detail="Average student rating" />
        </section>

        <section className="tw-content-grid">
          <Card className="tw-panel tw-bookings-panel">
            <div className="tw-section-heading">
              <div><span className="tw-eyebrow">STUDENT ACTIVITY</span><h2>Booking requests</h2></div>
              <span className="tw-count-pill">{requests.length} total</span>
            </div>
            <div className="tw-tabs" role="tablist" aria-label="Booking request status">
              {BOOKING_TABS.map((tab) => (
                <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>
                  {tab === "DECLINED" ? "Declined" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                  {tab === "PENDING" && pendingCount > 0 && <b>{pendingCount}</b>}
                </button>
              ))}
            </div>
            {filteredRequests.length === 0 ? (
              <EmptyState title={`No ${activeTab.toLowerCase()} requests`} text="Booking requests from students will appear here." />
            ) : (
              <div className="tw-request-list">
                {filteredRequests.map((request) => {
                  const student = request.student;
                  const subject = request.subject;
                  const id = request.bookingRequestId;
                  return (
                    <article className="tw-request-card" key={id}>
                      <div className="tw-request-top">
                        <div className="tw-student-avatar">{(student?.name?.[0] || "S").toUpperCase()}</div>
                        <div className="tw-request-person"><strong>{fullName(student)}</strong><span>{subject?.subjectName || "Subject not specified"}{subject?.subjectCode ? ` · ${subject.subjectCode}` : ""}</span></div>
                        <span className={statusClass(request.status)}>{request.status || "UNKNOWN"}</span>
                      </div>
                      <div className="tw-request-details">
                        <span><CalendarDays size={14} /> {readableDate(request.requestedStartTime)}</span>
                        <span><Clock3 size={14} /> {readableTime(request.requestedStartTime)} · {request.durationMinutes || 0} min</span>
                      </div>
                      {request.studentNotes && <p className="tw-student-note">“{request.studentNotes}”</p>}
                      {request.status === "PENDING" && <div className="tw-request-actions">
                        <button className="tw-button tw-button-primary" disabled={busyBookingId === id} onClick={() => changeBookingStatus(request, "APPROVED")}><Check size={15} /> {busyBookingId === id ? "Saving…" : "Accept request"}</button>
                        <button className="tw-button tw-button-danger" disabled={busyBookingId === id} onClick={() => changeBookingStatus(request, "DECLINED")}><X size={15} /> Decline</button>
                      </div>}
                    </article>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="tw-panel">
            <div className="tw-section-heading"><div><span className="tw-eyebrow">YOUR TEACHING</span><h2>Subjects offered</h2></div></div>
            {subjects.length === 0 ? <EmptyState title="No subjects linked" text="Your registered teaching subjects will appear here." /> : (
              <div className="tw-subject-list">
                {subjects.map((link) => {
                  const subject = link.subject || link;
                  return <div className="tw-subject-item" key={link.tutorSubjectId || subject.subjectId || subject.subjectCode}>
                    <span className="tw-subject-code">{subject.subjectCode || "SUB"}</span>
                    <div><strong>{subject.subjectName || "Unnamed subject"}</strong><small>{subject.department || "Department not specified"}</small></div>
                  </div>;
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="tw-content-grid tw-lower-grid">
          <Card className="tw-panel">
            <div className="tw-section-heading"><div><span className="tw-eyebrow">YOUR CALENDAR</span><h2>Upcoming sessions</h2></div><span className="tw-count-pill">{upcomingSessions.length} scheduled</span></div>
            {upcomingSessions.length === 0 ? <EmptyState title="No upcoming sessions" text="When you accept a booking, its session will appear here." /> : (
              <div className="tw-session-list">
                {upcomingSessions.map((session) => <article className="tw-session-item" key={session.tutoringSessionId}>
                  <div className="tw-session-date"><b>{new Date(session.startTime).getDate()}</b><span>{new Intl.DateTimeFormat("en-ZA", { month: "short" }).format(new Date(session.startTime))}</span></div>
                  <div className="tw-session-copy"><strong>{session.subject?.subjectName || "Tutoring session"}</strong><span>{fullName(session.student)} · {readableTime(session.startTime)}–{readableTime(session.endTime)}</span></div>
                  <span className={statusClass(session.status)}>{session.status || "SCHEDULED"}</span>
                </article>)}
              </div>
            )}
          </Card>

          <Card className="tw-panel">
            <div className="tw-section-heading"><div><span className="tw-eyebrow">SET YOUR HOURS</span><h2>Manage availability</h2></div></div>
            <form className="tw-availability-form" onSubmit={saveAvailability}>
              <Field label="Date"><input type="date" name="date" value={availabilityForm.date} onChange={updateAvailabilityField} required /></Field>
              <div className="tw-time-fields">
                <Field label="Start time"><input type="time" name="startTime" value={availabilityForm.startTime} onChange={updateAvailabilityField} required /></Field>
                <Field label="End time"><input type="time" name="endTime" value={availabilityForm.endTime} onChange={updateAvailabilityField} required /></Field>
              </div>
              <label className="tw-checkbox"><input type="checkbox" name="recurring" checked={availabilityForm.recurring} onChange={updateAvailabilityField} /> Repeat this availability weekly</label>
              <button className="tw-button tw-button-primary tw-full-button" type="submit" disabled={savingAvailability}><Plus size={16} /> {savingAvailability ? "Saving availability…" : "Add availability"}</button>
            </form>
            <div className="tw-existing-availability">
              <h3>Saved availability</h3>
              {availability.length === 0 ? <p className="tw-muted">No availability slots have been added.</p> : availability.map((slot) => <div className="tw-availability-item" key={slot.availabilityId}>
                <div><strong>{slot.dayOfWeek || "Day not set"}</strong><span>{readableDate(slot.startTime)} · {readableTime(slot.startTime)}–{readableTime(slot.endTime)} {slot.isRecurring ? "· Weekly" : ""}</span></div>
                <button type="button" className="tw-icon-danger" title="Delete availability" aria-label="Delete availability" onClick={() => deleteAvailability(slot)}><Trash2 size={16} /></button>
              </div>)}
            </div>
          </Card>
        </section>
      </>}
    </main>
  );
}
