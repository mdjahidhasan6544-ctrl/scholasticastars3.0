import { useCallback, useEffect, useMemo, useState } from "react";

import AppShell from "../components/AppShell.jsx";
import CourseForm from "../components/CourseForm.jsx";
import CourseGrid from "../components/CourseGrid.jsx";
import HealthPanel from "../components/HealthPanel.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { API_BASE_URL, api } from "../services/api.js";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  instructor: "",
  type: "free",
  price: "0",
  durationInHours: "",
  thumbnailUrl: "",
  order: "0",
  isPublished: true
};

function mapCourseToForm(course) {
  return {
    title: course.title || "",
    description: course.description || "",
    category: course.category || "",
    instructor: course.instructor || "",
    type: course.type || "free",
    price: String(course.price ?? 0),
    durationInHours: String(course.durationInHours ?? ""),
    thumbnailUrl: course.thumbnailUrl || "",
    order: String(course.order ?? 0),
    isPublished: Boolean(course.isPublished)
  };
}

function mapFormToPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    instructor: values.instructor.trim(),
    type: values.type,
    price: values.type === "free" ? 0 : Number(values.price || 0),
    durationInHours: Number(values.durationInHours || 0),
    thumbnailUrl: values.thumbnailUrl.trim(),
    order: Number(values.order || 0),
    isPublished: Boolean(values.isPublished)
  };
}

export default function DashboardPage() {
  const [health, setHealth] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingCourseId, setEditingCourseId] = useState("");
  const [formValues, setFormValues] = useState(emptyForm);

  const loadDashboard = useCallback(async (initialLoad = false) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const [healthResponse, coursesResponse] = await Promise.all([api.getHealth(), api.getCourses()]);
      setHealth(healthResponse.data);
      setCourses(coursesResponse.data || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const published = courses.filter((course) => course.isPublished).length;
    const paid = courses.filter((course) => course.type === "paid").length;

    return [
      { label: "Total courses", value: courses.length },
      { label: "Published", value: published },
      { label: "Paid offerings", value: paid }
    ];
  }, [courses]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormValues((current) => {
      const nextValues = {
        ...current,
        [name]: type === "checkbox" ? checked : value
      };

      if (name === "type" && value === "free") {
        nextValues.price = "0";
      }

      return nextValues;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = mapFormToPayload(formValues);

      if (editingCourseId) {
        await api.updateCourse(editingCourseId, payload);
        setMessage("Course updated successfully.");
      } else {
        await api.createCourse(payload);
        setMessage("Course created successfully.");
      }

      setEditingCourseId("");
      setFormValues(emptyForm);
      await loadDashboard();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(course) {
    setEditingCourseId(course._id || course.id);
    setFormValues(mapCourseToForm(course));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingCourseId("");
    setFormValues(emptyForm);
  }

  async function handleDelete(course) {
    const courseId = course._id || course.id;
    const confirmed = window.confirm(`Delete the course \"${course.title}\"?`);

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await api.deleteCourse(courseId);

      if (editingCourseId === courseId) {
        handleCancelEdit();
      }

      setMessage("Course deleted successfully.");
      await loadDashboard();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <AppShell endpoint={API_BASE_URL}>
      <div className="stats-row">
        {stats.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      {message ? <div className="banner banner--success">{message}</div> : null}
      {error ? <div className="banner banner--error">{error}</div> : null}

      {loading ? (
        <SectionCard
          eyebrow="Initialization"
          title="Connecting to your deployed backend"
          description="Loading health telemetry and course inventory from Render."
        >
          <div className="loading-state">Loading dashboard…</div>
        </SectionCard>
      ) : (
        <>
          <div className="dashboard-grid">
            <CourseForm
              values={formValues}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              isEditing={Boolean(editingCourseId)}
              isSaving={saving}
            />

            <HealthPanel health={health} />
          </div>

          <CourseGrid courses={courses} onEdit={handleEdit} onDelete={handleDelete} isRefreshing={refreshing} />
        </>
      )}
    </AppShell>
  );
}