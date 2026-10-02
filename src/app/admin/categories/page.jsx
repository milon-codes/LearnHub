"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FaBookOpen,
  FaCheckCircle,
  FaEdit,
  FaImage,
  FaPlus,
  FaSearch,
  FaSortNumericDown,
  FaTimesCircle,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
  // ==========================================
  // STATE
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [search, setSearch] = useState("");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form
  const initialForm = {
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    order: 0,
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  const [editingSlug, setEditingSlug] = useState("");

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch categories.");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);

      setError(error.message || "Something went wrong.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ==========================================
  // MESSAGE
  // ==========================================

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 4000);
  };

  // ==========================================
  // SLUG GENERATOR
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // NAME CHANGE
  // ==========================================

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: editMode ? prev.slug : generateSlug(value),
    }));
  };

  // ==========================================
  // OPEN CREATE
  // ==========================================

  const handleOpenCreate = () => {
    setEditMode(false);
    setEditingSlug("");
    setForm(initialForm);
    setError("");
    setMessage({
      type: "",
      text: "",
    });
    setDialogOpen(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleOpenEdit = (category) => {
    setEditMode(true);

    setEditingSlug(category.slug);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      order: category.order ?? 0,
      isActive: category.isActive ?? true,
    });

    setError("");
    setMessage({
      type: "",
      text: "",
    });

    setDialogOpen(true);
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("Category name is required.");
      }

      if (!form.slug.trim()) {
        throw new Error("Category slug is required.");
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        image: form.image.trim(),
        order: Number(form.order) || 0,
        isActive: Boolean(form.isActive),
      };

      let res;

      // ========================================
      // CREATE
      // ========================================

      if (!editMode) {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            slug: form.slug.toLowerCase().trim(),
          }),
        });
      }

      // ========================================
      // UPDATE
      // ========================================

      else {
        res = await fetch(
          `/api/admin/categories/${editingSlug.toLowerCase()}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...payload,
              newSlug: form.slug.toLowerCase().trim(),
            }),
          },
        );
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${editMode ? "update" : "create"} category.`,
        );
      }

      showMessage(
        "success",
        data.message ||
          `Category ${editMode ? "updated" : "created"} successfully.`,
      );

      setDialogOpen(false);
      setForm(initialForm);
      setEditingSlug("");
      setEditMode(false);

      await fetchCategories();
    } catch (error) {
      console.error("Category Save Error:", error);

      setError(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN DELETE
  // ==========================================

  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = async () => {
    if (!categoryToDelete?.slug) return;

    try {
      setDeletingSlug(categoryToDelete.slug);
      setError("");

      const res = await fetch(
        `/api/admin/categories/${categoryToDelete.slug}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category.");
      }

      showMessage(
        "success",
        data.message || "Category deleted successfully.",
      );

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);

      await fetchCategories();
    } catch (error) {
      console.error("Delete Category Error:", error);

      showMessage(
        "error",
        error.message || "Failed to delete category.",
      );
    } finally {
      setDeletingSlug("");
    }
  };

  // ==========================================
  // FILTER CATEGORIES
  // ==========================================

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(searchValue) ||
        category.slug?.toLowerCase().includes(searchValue) ||
        category.description?.toLowerCase().includes(searchValue)
      );
    });
  }, [categories, search]);

  // ==========================================
  // STATS
  // ==========================================

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive,
  ).length;

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-9 w-72" />
              <Skeleton className="mt-3 h-5 w-96 max-w-full" />
            </div>

            <Skeleton className="h-10 w-40" />
          </div>

          {/* Stats */}

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-3 h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}

          <Skeleton className="mb-6 h-12 w-full rounded-xl" />

          {/* Table */}

          <Card>
            <CardContent className="space-y-4 p-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-20 w-full rounded-xl"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR UI
  // ==========================================

  if (error && categories.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <FaBookOpen className="text-2xl" />
            </div>

            <h1 className="text-2xl font-bold">
              Unable to load categories
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <Button className="mt-6" onClick={fetchCategories}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <FaBookOpen />
              <span>Administration</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Category Management
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Create, update, organize, and manage course categories.
            </p>
          </div>

          <Button size="lg" onClick={handleOpenCreate}>
            <FaPlus className="mr-2" />
            Add Category
          </Button>
        </div>

        {/* ====================================== */}
        {/* MESSAGE */}
        {/* ====================================== */}

        {message.text && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <FaCheckCircle className="mt-0.5 shrink-0" />
            ) : (
              <FaTimesCircle className="mt-0.5 shrink-0" />
            )}

            <span>{message.text}</span>
          </div>
        )}

        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {/* Total */}

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Categories
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {totalCategories}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBookOpen />
              </div>
            </CardContent>
          </Card>

          {/* Active */}

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Categories
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {activeCategories}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400">
                <FaToggleOn />
              </div>
            </CardContent>
          </Card>

          {/* Inactive */}

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Inactive Categories
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {inactiveCategories}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <FaToggleOff />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================== */}
        {/* SEARCH */}
        {/* ====================================== */}

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search category by name, slug, or description..."
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* CATEGORY LIST */}
        {/* ====================================== */}

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>All Categories</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredCategories.length} of {totalCategories}{" "}
                  categories
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FaBookOpen className="text-2xl text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">
                  No categories found
                </h3>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {search
                    ? "No categories match your search."
                    : "Create your first course category."}
                </p>

                {!search && (
                  <Button
                    className="mt-5"
                    onClick={handleOpenCreate}
                  >
                    <FaPlus className="mr-2" />
                    Add Category
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* ================================== */}
                {/* DESKTOP TABLE */}
                {/* ================================== */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30 text-left text-sm">
                        <th className="px-6 py-4 font-medium">
                          Category
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Slug
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Order
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCategories.map((category) => (
                        <tr
                          key={category._id}
                          className="border-b last:border-0 hover:bg-muted/20"
                        >
                          {/* Category */}

                          <td className="px-6 py-4">
                            <div className="flex min-w-[300px] items-center gap-3">
                              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                                {category.image ? (
                                  <Image
                                    src={category?.image}
                                    alt={category?.name}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                 
                                ) : (
                                  <FaBookOpen className="text-muted-foreground" />
                                )}
                              </div>

                               {console.log(category, 'categoru')}

                              <div className="min-w-0">
                                <p className="font-semibold">
                                  {category.name}
                                </p>

                                <p className="mt-1 max-w-[320px] truncate text-xs text-muted-foreground">
                                  {category.description ||
                                    "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Slug */}

                          <td className="px-6 py-4">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              {category.slug}
                            </code>
                          </td>

                          {/* Order */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <FaSortNumericDown className="text-muted-foreground" />
                              {category.order ?? 0}
                            </div>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">
                            {category.isActive ? (
                              <Badge className="border-0 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                <FaCheckCircle className="mr-1.5" />
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-muted-foreground"
                              >
                                <FaTimesCircle className="mr-1.5" />
                                Inactive
                              </Badge>
                            )}
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleOpenEdit(category)
                                }
                              >
                                <FaEdit className="mr-2" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleOpenDelete(category)
                                }
                                disabled={
                                  deletingSlug === category.slug
                                }
                              >
                                <FaTrash className="mr-2" />

                                {deletingSlug === category.slug
                                  ? "Deleting..."
                                  : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ================================== */}
                {/* MOBILE / TABLET */}
                {/* ================================== */}

                <div className="grid gap-4 p-4 lg:hidden">
                  {filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      className="rounded-xl border bg-card p-4"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FaBookOpen className="text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold">
                              {category.name}
                            </h3>

                            {category.isActive ? (
                              <Badge className="shrink-0 border-0 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="shrink-0"
                              >
                                Inactive
                              </Badge>
                            )}
                          </div>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {category.slug}
                          </p>

                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {category.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Display Order
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                            <FaSortNumericDown className="text-muted-foreground" />
                            {category.order ?? 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Icon
                          </p>

                          <p className="mt-1 truncate text-sm font-medium">
                            {category.icon || "Not set"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleOpenEdit(category)
                          }
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleOpenDelete(category)
                          }
                          disabled={
                            deletingSlug === category.slug
                          }
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ====================================== */}
        {/* FOOTER INFO */}
        {/* ====================================== */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FaCheckCircle />

          <span>
            Category management is protected by admin authorization.
          </span>
        </div>
      </div>

      {/* ========================================== */}
      {/* CREATE / EDIT DIALOG */}
      {/* ========================================== */}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Category" : "Create Category"}
            </DialogTitle>

            <DialogDescription>
              {editMode
                ? "Update the category information and save your changes."
                : "Create a new category for your courses."}
            </DialogDescription>
          </DialogHeader>

          {/* Form Error */}

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              <FaTimesCircle className="mt-0.5 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}

            <div className="space-y-2">
              <Label htmlFor="category-name">
                Category Name
              </Label>

              <Input
                id="category-name"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Web Development"
                required
              />
            </div>

            {/* Slug */}

            <div className="space-y-2">
              <Label htmlFor="category-slug">
                Slug
              </Label>

              <Input
                id="category-slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="web-development"
                required
              />

              <p className="text-xs text-muted-foreground">
                URL-friendly category identifier.
              </p>
            </div>

            {/* Description */}

            <div className="space-y-2">
              <Label htmlFor="category-description">
                Description
              </Label>

              <Textarea
                id="category-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={4}
              />
            </div>

            {/* Icon + Order */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-icon">
                  Icon Name
                </Label>

                <Input
                  id="category-icon"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="FaLaptopCode"
                />

                <p className="text-xs text-muted-foreground">
                  Example: FaLaptopCode
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-order">
                  Display Order
                </Label>

                <Input
                  id="category-order"
                  name="order"
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={handleChange}
                />

                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first.
                </p>
              </div>
            </div>

            {/* Image */}

            <div className="space-y-2">
              <Label htmlFor="category-image">
                Image URL
              </Label>

              <Input
                id="category-image"
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Image Preview */}

            <div className="space-y-2">
              <Label>Image Preview</Label>

              <div className="relative aspect-[16/6] overflow-hidden rounded-xl border bg-muted">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt={form.name || "Category preview"}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <FaImage className="mb-2 text-2xl" />

                    <span className="text-sm">
                      No image selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Active */}

            <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium">
                  Active Category
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Active categories can be used for courses.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-primary"
              />
            </label>

            {/* Footer */}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                    {editMode
                      ? "Updating..."
                      : "Creating..."}
                  </>
                ) : (
                  <>
                    {editMode ? (
                      <FaEdit className="mr-2" />
                    ) : (
                      <FaPlus className="mr-2" />
                    )}

                    {editMode
                      ? "Update Category"
                      : "Create Category"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* DELETE DIALOG */}
      {/* ========================================== */}

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete Category?
            </DialogTitle>

            <DialogDescription>
              This action cannot be undone. The category will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>

          {categoryToDelete && (
            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                  <FaBookOpen className="text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    {categoryToDelete.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {categoryToDelete.slug}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={Boolean(deletingSlug)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={Boolean(deletingSlug)}
            >
              {deletingSlug ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  Delete Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}