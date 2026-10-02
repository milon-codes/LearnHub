"use client";

import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import LessonManager from "./LessonManager";

export default function CourseSections({ slug }) {
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // FETCH SECTIONS
  // ==========================================

  const fetchSections = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/instructor/courses/${slug}/sections`);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load sections.");
      }

      setSections(data.sections || []);
    } catch (error) {
      console.error("Fetch Sections Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to load sections.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchSections();
    }
  }, [slug]);

  // ==========================================
  // CREATE FORM CHANGE
  // ==========================================

  const handleCreateChange = (e) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE SECTION
  // ==========================================

  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!createForm.title.trim()) {
      setMessage({
        type: "error",
        text: "Section title is required.",
      });

      return;
    }

    try {
      setCreating(true);

      setMessage({
        type: "",
        text: "",
      });

      const res = await fetch(`/api/instructor/courses/${slug}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: createForm.title.trim(),
          description: createForm.description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create section.");
      }

      setSections((prev) =>
        [...prev, data.section].sort((a, b) => a.order - b.order),
      );

      setCreateForm({
        title: "",
        description: "",
      });

      setShowCreateForm(false);

      setMessage({
        type: "success",
        text: "Section created successfully.",
      });
    } catch (error) {
      console.error("Create Section Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to create section.",
      });
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const handleStartEdit = (section) => {
    setEditingId(section._id);

    setEditForm({
      title: section.title || "",
      description: section.description || "",
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditForm({
      title: "",
      description: "",
    });
  };

  // ==========================================
  // UPDATE SECTION
  // ==========================================

  const handleUpdateSection = async (e, section) => {
    e.preventDefault();

    if (!editForm.title.trim()) {
      setMessage({
        type: "error",
        text: "Section title is required.",
      });

      return;
    }

    try {
      setUpdating(true);

      setMessage({
        type: "",
        text: "",
      });

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${section._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            order: section.order,
            isPublished: section.isPublished,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update section.");
      }

      setSections((prev) =>
        prev.map((item) => (item._id === section._id ? data.section : item)),
      );

      setEditingId(null);

      setEditForm({
        title: "",
        description: "",
      });

      setMessage({
        type: "success",
        text: "Section updated successfully.",
      });
    } catch (error) {
      console.error("Update Section Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to update section.",
      });
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE SECTION
  // ==========================================

  const handleDeleteSection = async (sectionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this section?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(sectionId);

      setMessage({
        type: "",
        text: "",
      });

      const res = await fetch(
        `/api/instructor/courses/${slug}/sections/${sectionId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete section.");
      }

      setSections((prev) =>
        prev.filter((section) => section._id !== sectionId),
      );

      if (editingId === sectionId) {
        setEditingId(null);
      }

      if (expandedId === sectionId) {
        setExpandedId(null);
      }

      setMessage({
        type: "success",
        text: "Section deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Section Error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to delete section.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="h-7 w-40 animate-pulse rounded bg-muted" />

          <div className="h-20 animate-pulse rounded-xl bg-muted" />

          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <Card className="mt-28">
      <CardContent className="p-6">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-primary" />

              <h2 className="text-xl font-semibold">Course Content</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Organize your course into sections and lessons.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            {showCreateForm ? (
              <>
                <FaTimes className="mr-2" />
                Close
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Add Section
              </>
            )}
          </Button>
        </div>

        {/* ====================================== */}
        {/* MESSAGE */}
        {/* ====================================== */}

        {message.text && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ====================================== */}
        {/* CREATE SECTION FORM */}
        {/* ====================================== */}

        {showCreateForm && (
          <form
            onSubmit={handleCreateSection}
            className="mt-6 rounded-2xl border bg-muted/20 p-5"
          >
            <h3 className="font-semibold">Create New Section</h3>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="section-title" className="text-sm font-medium">
                  Section Title
                </label>

                <Input
                  id="section-title"
                  name="title"
                  value={createForm.title}
                  onChange={handleCreateChange}
                  placeholder="e.g. HTML Fundamentals"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="section-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <Textarea
                  id="section-description"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  placeholder="What will students learn in this section?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);

                    setCreateForm({
                      title: "",
                      description: "",
                    });
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" />
                      Create Section
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ====================================== */}
        {/* SECTIONS */}
        {/* ====================================== */}

        <div className="mt-6 space-y-3">
          {sections.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <FaBookOpen className="mx-auto text-3xl text-muted-foreground/40" />

              <h3 className="mt-4 font-semibold">No sections yet</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Start building your course by creating the first section.
              </p>

              <Button
                type="button"
                className="mt-5"
                onClick={() => setShowCreateForm(true)}
              >
                <FaPlus className="mr-2" />
                Create First Section
              </Button>
            </div>
          ) : (
            [...sections]
              .sort((a, b) => a.order - b.order)
              .map((section, index) => {
                const isExpanded = expandedId === section._id;

                const isEditing = editingId === section._id;

                return (
                  <div
                    key={section._id}
                    className="overflow-hidden rounded-2xl border bg-background"
                  >
                    {/* ================================= */}
                    {/* EDIT SECTION */}
                    {/* ================================= */}

                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleUpdateSection(e, section)}
                        className="p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="font-semibold">Edit Section</h3>

                            <p className="text-xs text-muted-foreground">
                              Update your section information.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Section Title
                            </label>

                            <Input
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              placeholder="Section title"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>

                            <Textarea
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              placeholder="Section description"
                              rows={3}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={updating}
                            >
                              <FaTimes className="mr-2" />
                              Cancel
                            </Button>

                            <Button type="submit" disabled={updating}>
                              {updating ? (
                                <>
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <FaSave className="mr-2" />
                                  Update Section
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <>
                        {/* ============================== */}
                        {/* SECTION HEADER */}
                        {/* ============================== */}

                        <div className="flex items-center gap-3 p-4 sm:p-5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                            {index + 1}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : section._id)
                            }
                            className="min-w-0 flex-1 text-left"
                          >
                            <h3 className="truncate font-semibold">
                              {section.title}
                            </h3>

                            {section.description && (
                              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                {section.description}
                              </p>
                            )}
                          </button>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title={isExpanded ? "Collapse" : "Expand"}
                              onClick={() =>
                                setExpandedId(isExpanded ? null : section._id)
                              }
                            >
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit section"
                              onClick={() => handleStartEdit(section)}
                            >
                              <FaEdit />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Delete section"
                              disabled={deletingId === section._id}
                              onClick={() => handleDeleteSection(section._id)}
                            >
                              {deletingId === section._id ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <FaTrash className="text-destructive" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* ================================= */}
                        {/* LESSON MANAGER */}
                        {/* ================================= */}

                        {isExpanded && (
                          <div className="border-t bg-muted/20 px-4 py-5 sm:px-5">
                            <LessonManager
                              slug={slug}
                              sectionId={section._id}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
