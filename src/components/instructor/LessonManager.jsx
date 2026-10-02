"use client";

import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCheckCircle,
  FaCircle,
  FaClock,
  FaEdit,
  FaFileAlt,
  FaLink,
  FaPlayCircle,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaVideo,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LessonManager({ slug, sectionId }) {
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "video",
    videoUrl: "",
    content: "",
    duration: "",
    isFree: false,
    isPublished: false,
  });

  // ==========================================
  // FETCH LESSONS
  // ==========================================

  const fetchLessons = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${sectionId}/lessons`,
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load lessons.");
      }

      setLessons(data.lessons || []);
    } catch (error) {
      console.error("Fetch Lessons Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to load lessons.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && sectionId) {
      fetchLessons();
    }
  }, [slug, sectionId]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // TYPE CHANGE
  // ==========================================

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      videoUrl: "",
      content: "",
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "video",
      videoUrl: "",
      content: "",
      duration: "",
      isFree: false,
      isPublished: false,
    });

    setEditingId(null);
  };

  // ==========================================
  // OPEN CREATE FORM
  // ==========================================

  const handleOpenCreate = () => {
    resetForm();

    setMessage({
      type: "",
      text: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (creating || updating) return;

    resetForm();
    setShowForm(false);
  };

  // ==========================================
  // CREATE LESSON
  // ==========================================

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Lesson title is required.",
      });

      return;
    }

    if (form.type === "video" && !form.videoUrl.trim()) {
      setMessage({
        type: "error",
        text: "Video URL is required.",
      });

      return;
    }

    if (form.type === "article" && !form.content.trim()) {
      setMessage({
        type: "error",
        text: "Article content is required.",
      });

      return;
    }

    try {
      setCreating(true);

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${sectionId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),

            type: form.type,

            videoUrl: form.type === "video" ? form.videoUrl.trim() : "",

            content: form.type === "article" ? form.content.trim() : "",

            duration: Number(form.duration) || 0,

            isFree: form.isFree,
            isPublished: form.isPublished,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create lesson.");
      }

      setLessons((prev) =>
        [...prev, data.lesson].sort((a, b) => a.order - b.order),
      );

      resetForm();
      setShowForm(false);

      setMessage({
        type: "success",
        text: "Lesson created successfully.",
      });
    } catch (error) {
      console.error("Create Lesson Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to create lesson.",
      });
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleEdit = (lesson) => {
    console.log(lesson._id, "lesson id");

    setEditingId(lesson._id);

    setForm({
      title: lesson.title || "",
      description: lesson.description || "",
      type: lesson.type || "video",
      videoUrl: lesson.videoUrl || "",
      content: lesson.content || "",
      duration: lesson.duration || "",
      isFree: Boolean(lesson.isFree),
      isPublished: Boolean(lesson.isPublished),
    });

    setMessage({
      type: "",
      text: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // UPDATE LESSON
  // ==========================================

  console.log("edit data", editingId);
  const handleUpdateLesson = async (e) => {
    e.preventDefault();

    if (!editingId) return;
    console.log("edit data", editingId);

    setMessage({
      type: "",
      text: "",
    });

    if (!form.title.trim()) {
      setMessage({
        type: "error",
        text: "Lesson title is required.",
      });

      return;
    }

    if (form.type === "video" && !form.videoUrl.trim()) {
      setMessage({
        type: "error",
        text: "Video URL is required.",
      });

      return;
    }

    if (form.type === "article" && !form.content.trim()) {
      setMessage({
        type: "error",
        text: "Article content is required.",
      });

      return;
    }

    try {
      setUpdating(true);

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${sectionId}/lessons/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),

            description: form.description.trim(),

            type: form.type,

            videoUrl: form.type === "video" ? form.videoUrl.trim() : "",

            content: form.type === "article" ? form.content.trim() : "",

            duration: Number(form.duration) || 0,

            isFree: form.isFree,

            isPublished: form.isPublished,
          }),
        },
      );

      const data = await res.json();

      console.log(data, editingId, "listen");

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update lesson.");
      }

      setLessons((prev) =>
        prev.map((lesson) => (lesson._id === editingId ? data.lesson : lesson)),
      );

      resetForm();
      setShowForm(false);

      setMessage({
        type: "success",
        text: "Lesson updated successfully.",
      });
    } catch (error) {
      console.error("Update Lesson Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to update lesson.",
      });
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE LESSON
  // ==========================================

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(lessonId);

      setMessage({
        type: "",
        text: "",
      });

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${sectionId}/lessons/${lessonId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete lesson.");
      }

      setLessons((prev) => prev.filter((lesson) => lesson._id !== lessonId));

      if (editingId === lessonId) {
        resetForm();
        setShowForm(false);
      }

      setMessage({
        type: "success",
        text: "Lesson deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Lesson Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to delete lesson.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-background p-4">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <FaBookOpen className="text-primary" />
            Lessons
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
              {lessons.length}
            </span>
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage lessons inside this section.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={showForm ? handleCloseForm : handleOpenCreate}
          disabled={creating || updating}
        >
          {showForm ? (
            <>
              <FaTimes className="mr-2" />
              Close
            </>
          ) : (
            <>
              <FaPlus className="mr-2" />
              Add Lesson
            </>
          )}
        </Button>
      </div>

      {/* ====================================== */}
      {/* MESSAGE */}
      {/* ====================================== */}

      {message.text && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ====================================== */}
      {/* CREATE / EDIT FORM */}
      {/* ====================================== */}

      {showForm && (
        <form
          onSubmit={editingId ? handleUpdateLesson : handleCreateLesson}
          className="mt-5 space-y-5 rounded-xl border bg-muted/20 p-4"
        >
          {/* FORM HEADER */}

          <div>
            <div className="flex items-center gap-2">
              {editingId ? (
                <FaEdit className="text-primary" />
              ) : (
                <FaPlus className="text-primary" />
              )}

              <h5 className="font-semibold">
                {editingId ? "Edit Lesson" : "Create Lesson"}
              </h5>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {editingId
                ? "Update this lesson information."
                : "Add a video or article lesson."}
            </p>
          </div>

          {/* TITLE */}

          <div className="space-y-2">
            <label
              htmlFor={`lesson-title-${sectionId}`}
              className="text-sm font-medium"
            >
              Lesson Title
            </label>

            <Input
              id={`lesson-title-${sectionId}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to HTML"
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">
            <label
              htmlFor={`lesson-description-${sectionId}`}
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id={`lesson-description-${sectionId}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will students learn?"
              rows={3}
            />
          </div>

          {/* LESSON TYPE */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Lesson Type</label>

            <div className="grid grid-cols-2 gap-3">
              {/* VIDEO */}

              <button
                type="button"
                onClick={() => handleTypeChange("video")}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  form.type === "video"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <FaVideo
                  className={
                    form.type === "video"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />

                <div>
                  <p className="text-sm font-medium">Video</p>

                  <p className="text-xs text-muted-foreground">Video lesson</p>
                </div>
              </button>

              {/* ARTICLE */}

              <button
                type="button"
                onClick={() => handleTypeChange("article")}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  form.type === "article"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <FaFileAlt
                  className={
                    form.type === "article"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />

                <div>
                  <p className="text-sm font-medium">Article</p>

                  <p className="text-xs text-muted-foreground">Text lesson</p>
                </div>
              </button>
            </div>
          </div>

          {/* VIDEO URL */}

          {form.type === "video" && (
            <div className="space-y-2">
              <label
                htmlFor={`video-url-${sectionId}`}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <FaLink className="text-muted-foreground" />
                Video URL
              </label>

              <Input
                id={`video-url-${sectionId}`}
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                type="url"
                required
              />
            </div>
          )}

          {/* ARTICLE CONTENT */}

          {form.type === "article" && (
            <div className="space-y-2">
              <label
                htmlFor={`lesson-content-${sectionId}`}
                className="text-sm font-medium"
              >
                Article Content
              </label>

              <Textarea
                id={`lesson-content-${sectionId}`}
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write lesson content here..."
                rows={7}
                required
              />
            </div>
          )}

          {/* DURATION */}

          <div className="space-y-2">
            <label
              htmlFor={`lesson-duration-${sectionId}`}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FaClock className="text-muted-foreground" />
              Duration (minutes)
            </label>

            <Input
              id={`lesson-duration-${sectionId}`}
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 25"
              type="number"
              min="0"
            />
          </div>

          {/* OPTIONS */}

          <div className="grid gap-3 sm:grid-cols-2">
            {/* FREE */}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />

              <div>
                <p className="text-sm font-medium">Free Preview</p>

                <p className="text-xs text-muted-foreground">
                  Students can view this lesson free.
                </p>
              </div>
            </label>

            {/* PUBLISHED */}

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />

              <div>
                <p className="text-sm font-medium">Published</p>

                <p className="text-xs text-muted-foreground">
                  Make this lesson available.
                </p>
              </div>
            </label>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseForm}
              disabled={creating || updating}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={creating || updating}>
              {editingId ? (
                updating ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Lesson
                  </>
                )
              ) : creating ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Create Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* ====================================== */}
      {/* LESSON LIST */}
      {/* ====================================== */}

      <div className="mt-5 space-y-2">
        {loading ? (
          <>
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
          </>
        ) : lessons.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <FaPlayCircle className="mx-auto text-2xl text-muted-foreground/40" />

            <p className="mt-2 text-sm font-medium">No lessons yet</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Add the first lesson to this section.
            </p>
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <div
              key={lesson._id}
              className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center"
            >
              {/* NUMBER */}

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </div>

              {/* ICON */}

              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted sm:flex">
                {lesson.type === "video" ? (
                  <FaPlayCircle className="text-primary" />
                ) : (
                  <FaFileAlt className="text-primary" />
                )}
              </div>

              {/* INFO */}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{lesson.title}</p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{lesson.type}</span>

                  {lesson.duration > 0 && (
                    <>
                      <FaCircle className="h-1 w-1" />

                      <span>{lesson.duration} min</span>
                    </>
                  )}

                  {lesson.isFree && (
                    <>
                      <FaCircle className="h-1 w-1" />

                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* STATUS */}

              <div className="flex items-center gap-2">
                {lesson.isPublished ? (
                  <FaCheckCircle title="Published" className="text-green-500" />
                ) : (
                  <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                    Draft
                  </span>
                )}

                {/* EDIT */}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Edit lesson"
                  onClick={() => handleEdit(lesson)}
                  disabled={deletingId === lesson._id || updating || creating}
                >
                  <FaEdit />
                </Button>

                {/* DELETE */}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Delete lesson"
                  onClick={() => handleDelete(lesson._id)}
                  disabled={deletingId === lesson._id || updating || creating}
                >
                  {deletingId === lesson._id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <FaTrash />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
