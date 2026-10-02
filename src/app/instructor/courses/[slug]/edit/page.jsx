"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheck,
  FaImage,
  FaPlus,
  FaSave,
  FaTag,
  FaTrash,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.slug;

  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    newSlug: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    category: "",
    price: "",
    discountPrice: "",
    level: "beginner",
    language: "English",
    duration: "",
    requirements: [""],
    whatYouWillLearn: [""],
    tags: [""],
  });

  // --------------------------------
  // Fetch Course + Categories
  // --------------------------------

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingCategories(true);
        setMessage({ type: "", text: "" });

        const [courseRes, categoryRes] = await Promise.all([
          fetch(`/api/instructor/courses/${slug}`),
          fetch("/api/categories"),
        ]);

        const courseData = await courseRes.json();
        const categoryData = await categoryRes.json();

        if (!courseRes.ok) {
          setMessage({
            type: "error",
            text: courseData.message || "Failed to load course.",
          });
          return;
        }

        if (!categoryRes.ok) {
          setMessage({
            type: "error",
            text: categoryData.message || "Failed to load categories.",
          });
          return;
        }

        const currentCourse = courseData.course;

        setCourse(currentCourse);
        setCategories(categoryData.categories || []);

        setFormData({
          title: currentCourse.title || "",
          newSlug: currentCourse.slug || "",
          shortDescription: currentCourse.shortDescription || "",
          description: currentCourse.description || "",
          thumbnail: currentCourse.thumbnail || "",
          category: currentCourse.category?._id || "",
          price:
            currentCourse.price !== undefined
              ? String(currentCourse.price)
              : "",
          discountPrice:
            currentCourse.discountPrice !== undefined
              ? String(currentCourse.discountPrice)
              : "",
          level: currentCourse.level || "beginner",
          language: currentCourse.language || "English",
          duration:
            currentCourse.duration !== undefined
              ? String(currentCourse.duration)
              : "",
          requirements:
            currentCourse.requirements?.length > 0
              ? currentCourse.requirements
              : [""],
          whatYouWillLearn:
            currentCourse.whatYouWillLearn?.length > 0
              ? currentCourse.whatYouWillLearn
              : [""],
          tags: currentCourse.tags?.length > 0 ? currentCourse.tags : [""],
        });
      } catch (error) {
        console.error("Load Edit Course Error:", error);

        setMessage({
          type: "error",
          text: "Something went wrong while loading the course.",
        });
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    loadData();
  }, [slug]);

  // --------------------------------
  // Basic Input
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------
  // Slug Generator
  // --------------------------------

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title: value,
      newSlug: generateSlug(value),
    }));
  };

  // --------------------------------
  // Array Fields
  // --------------------------------

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];

      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: updated.length > 0 ? updated : [""],
      };
    });
  };

  // --------------------------------
  // Submit
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        newSlug: formData.newSlug.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        thumbnail: formData.thumbnail.trim(),
        category: formData.category,
        price: Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        level: formData.level,
        language: formData.language.trim(),
        duration: Number(formData.duration) || 0,

        requirements: formData.requirements
          .map((item) => item.trim())
          .filter(Boolean),

        whatYouWillLearn: formData.whatYouWillLearn
          .map((item) => item.trim())
          .filter(Boolean),

        tags: formData.tags.map((item) => item.trim()).filter(Boolean),
      };

      const res = await fetch(`/api/instructor/courses/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || "Failed to update course.",
        });

        return;
      }

      setCourse(data.course);

      setMessage({
        type: "success",
        text: "Course updated successfully!",
      });

      // If slug changed, redirect to new edit URL
      const updatedSlug = data.course?.slug || slug;

      setTimeout(() => {
        router.push(`/instructor/courses/${updatedSlug}`);
      }, 1000);
    } catch (error) {
      console.error("Update Course Error:", error);

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-12 rounded bg-muted" />
            <div className="h-32 rounded bg-muted" />
            <div className="h-32 rounded bg-muted" />
            <div className="h-32 rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------
  // Main UI
  // --------------------------------

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/instructor/courses/${slug}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaArrowLeft />
            Back to Course
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-primary">
                <FaBookOpen />
                <span>Course Management</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Edit Course
              </h1>

              <p className="mt-2 text-muted-foreground">
                Update your course information and learning content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Message */}
          {message.text && (
            <div
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              }`}
            >
              {message.type === "success" && <FaCheck />}

              <span>{message.text}</span>
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>

                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Modern Full Stack Web Development"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="newSlug">Course Slug</Label>

                <Input
                  id="newSlug"
                  name="newSlug"
                  value={formData.newSlug}
                  onChange={handleChange}
                  placeholder="modern-full-stack-web-development"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  This will be used in the course URL.
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>

                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Write a short description of your course..."
                  rows={3}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>

                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write the full course description..."
                  rows={7}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Media */}
          <Card>
            <CardHeader>
              <CardTitle>Course Thumbnail</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>

                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              {formData.thumbnail ? (
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={formData.thumbnail}
                    alt="Course thumbnail preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-muted/30 text-muted-foreground">
                  <div className="text-center">
                    <FaImage className="mx-auto mb-2 text-3xl" />
                    <p className="text-sm">
                      Thumbnail preview will appear here.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>

                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingCategories
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label>Level</Label>

                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      level: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>

                    <SelectItem value="intermediate">Intermediate</SelectItem>

                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>

                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="English"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Hours)</Label>

                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Original Price</Label>

                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>

                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="4999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayChange("requirements", index, e.target.value)
                    }
                    placeholder={`Requirement ${index + 1}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("requirements", index)}
                  >
                    <FaTrash className="text-destructive" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("requirements")}
              >
                <FaPlus className="mr-2" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>

          {/* What You Will Learn */}
          <Card>
            <CardHeader>
              <CardTitle>What Students Will Learn</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(
                        "whatYouWillLearn",
                        index,
                        e.target.value,
                      )
                    }
                    placeholder={`Learning outcome ${index + 1}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("whatYouWillLearn", index)}
                  >
                    <FaTrash className="text-destructive" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("whatYouWillLearn")}
              >
                <FaPlus className="mr-2" />
                Add Learning Outcome
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Course Tags</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {formData.tags.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      className="pl-9"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("tags", index, e.target.value)
                      }
                      placeholder={`Tag ${index + 1}`}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("tags", index)}
                  >
                    <FaTrash className="text-destructive" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("tags")}
              >
                <FaPlus className="mr-2" />
                Add Tag
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/instructor/courses/${slug}`} />}
            >
              Cancel
            </Button>

            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
