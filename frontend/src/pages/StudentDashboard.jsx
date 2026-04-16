import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance.js";
import CourseCard from "../components/CourseCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isApproved = user?.isVerifiedStudent && user?.status === "active";

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const requests = [axiosInstance.get("/api/courses")];

        if (isApproved) {
          requests.push(axiosInstance.get("/api/live-classes"));
        }

        const [coursesResponse, liveClassesResponse] = await Promise.all(requests);

        if (!isMounted) {
          return;
        }

        setCourses(coursesResponse.data.courses);
        setLiveClasses(isApproved ? liveClassesResponse.data.liveClasses : []);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.response?.data?.message || "Unable to load dashboard");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isApproved]);

  const accessibleCourses = courses.filter((course) => course.isAccessible);
  const lockedCourses = courses.filter((course) => course.isLocked);
  const paidCourses = courses.filter((course) => course.type === "paid");
  const nextLiveClass = liveClasses.find((item) => item.isUpcoming) || liveClasses[0];

  return (
    <div className="stack page-gap">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{isApproved ? "Learning workspace" : "Account review"}</p>
          <h2>
            {isApproved
              ? `${user?.name}, your approved courses and live sessions are ready.`
              : `${user?.name}, you can now submit payment while admin approval is in progress.`}
          </h2>
          <p>
            {isApproved
              ? "Free courses open instantly. Paid courses unlock after manual admin assignment or payment verification."
              : "Complete your profile, choose a paid course, and submit the payment details. Admin review will activate learning access after approval."}
          </p>
        </div>
        <div className="stats-grid">
          <article className="stat-card">
            <span>{isApproved ? accessibleCourses.length : paidCourses.length}</span>
            <p>{isApproved ? "Open courses" : "Paid courses"}</p>
          </article>
          <article className="stat-card">
            <span>{lockedCourses.length}</span>
            <p>{isApproved ? "Locked courses" : "Waiting unlock"}</p>
          </article>
          <article className="stat-card">
            <span>{isApproved ? liveClasses.length : user?.isVerifiedStudent ? "Ready" : "Pending"}</span>
            <p>{isApproved ? "Live sessions" : "Approval"}</p>
          </article>
        </div>
      </section>

      {!isApproved ? (
        <section className="content-panel spotlight-row">
          <div>
            <p className="eyebrow">Next step</p>
            <h3>Submit payment, then wait for admin approval.</h3>
            <p>
              You can access the payment form immediately after login. Once payment is reviewed and your account is approved,
              courses and live classes will unlock automatically.
            </p>
          </div>
          <div className="button-row">
            <Link className="button button-primary" to="/payments">
              Open payment form
            </Link>
            <Link className="button button-secondary" to="/profile">
              Update profile
            </Link>
          </div>
        </section>
      ) : null}

      {isApproved && nextLiveClass ? (
        <section className="content-panel spotlight-row">
          <div>
            <p className="eyebrow">Next live class</p>
            <h3>{nextLiveClass.title}</h3>
            <p>{formatDateTime(nextLiveClass.scheduledAt)}</p>
          </div>
          <Link className="button button-primary" to="/live-classes">
            View live schedule
          </Link>
        </section>
      ) : null}

      {loading ? <div className="content-panel">Loading dashboard...</div> : null}
      {error ? <div className="content-panel error-text">{error}</div> : null}

      {!loading && !error ? (
        isApproved ? (
          <>
          <section className="stack">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Continue learning</p>
                <h3>Accessible courses</h3>
              </div>
            </div>
            <div className="course-grid">
              {accessibleCourses.length > 0 ? (
                accessibleCourses.map((course) => <CourseCard course={course} key={course.id} />)
              ) : (
                <div className="content-panel">No accessible courses yet.</div>
              )}
            </div>
          </section>

          <section className="stack">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Premium track</p>
                <h3>Locked paid courses</h3>
              </div>
            </div>
            <div className="course-grid">
              {lockedCourses.length > 0 ? (
                lockedCourses.map((course) => <CourseCard course={course} key={course.id} />)
              ) : (
                <div className="content-panel">All published courses are already unlocked for you.</div>
              )}
            </div>
          </section>
          </>
        ) : (
          <section className="stack">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Payment queue</p>
                <h3>Choose a paid course and submit payment</h3>
              </div>
            </div>
            <div className="course-grid">
              {paidCourses.length > 0 ? (
                paidCourses.map((course) => (
                  <CourseCard course={course} key={course.id} primaryAction="payment" />
                ))
              ) : (
                <div className="content-panel">No paid courses are published yet.</div>
              )}
            </div>
          </section>
        )
      ) : null}
    </div>
  );
}
