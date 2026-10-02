"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheck,
  FaImage,
  FaPlus,
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

export default function CreateCoursePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const res = await fetch("/api/instructor/categories");
        const data = await res.json();
        console.log(data, "data");

        if (data.success) {
          setCategories(data.categories);
        } else {
          setMessage({
            type: "error",
            text: data.message || "Failed to load categories.",
          });
        }
      } catch (error) {
        console.error("Fetch Categories Error:", error);

        setMessage({
          type: "error",
          text: "Failed to load categories.",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto generate slug
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
      slug: generateSlug(value),
    }));
  };

  // Array field change
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

  // Add array item
  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Remove array item
  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: updated.length ? updated : [""],
      };
    });
  };

  // Submit course
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    setSubmitting(true);

    try {
      const payload = {
        ...formData,

        price: Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        duration: Number(formData.duration) || 0,

        requirements: formData.requirements.filter(
          (item) => item.trim() !== "",
        ),

        whatYouWillLearn: formData.whatYouWillLearn.filter(
          (item) => item.trim() !== "",
        ),

        tags: formData.tags.filter((item) => item.trim() !== ""),
      };

      const res = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || "Failed to create course.",
        });

        return;
      }

      setMessage({
        type: "success",
        text: "Course created successfully!",
      });

      // Go to instructor courses after short delay
      setTimeout(() => {
        router.push("/instructor/courses");
      }, 1000);
    } catch (error) {
      console.error("Create Course Error:", error);

      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 -ml-3"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="mr-2 text-sm" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBookOpen />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Create New Course
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create and organize your course content.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" && <FaCheck />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>

                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Modern Web Development"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Course Slug *</Label>

                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="modern-web-development"
                      required
                    />

                    <p className="text-xs text-muted-foreground">
                      URL-friendly course identifier.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>

                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      placeholder="Briefly describe what students will learn."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>

                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a detailed description of your course..."
                      rows={7}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Category *</Label>

                      <Select
                        value={formData.category}
                        items={categories
                          .filter((category) => category.isActive)
                          .map((category) => ({
                            value: category._id,
                            label: category.name,
                          }))}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
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

                        <SelectContent alignItemWithTrigger={false}>
                          {categories
                            .filter((category) => category.isActive)
                            .map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

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
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>

                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>

                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
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

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours)</Label>

                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        min="0"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Original Price</Label>

                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="5000"
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
                        placeholder="3000"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Leave both prices as 0 if the course is free.
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {formData.requirements.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "requirements",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder={`Requirement ${index + 1}`}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("requirements", index)}
                      >
                        <FaTrash className="text-xs" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("requirements")}
                  >
                    <FaPlus className="mr-2 text-xs" />
                    Add Requirement
                  </Button>
                </CardContent>
              </Card>

              {/* What You Will Learn */}
              <Card>
                <CardHeader>
                  <CardTitle>What Students Will Learn</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
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
                        onClick={() =>
                          removeArrayItem("whatYouWillLearn", index)
                        }
                      >
                        <FaTrash className="text-xs" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("whatYouWillLearn")}
                  >
                    <FaPlus className="mr-2 text-xs" />
                    Add Learning Outcome
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaTag className="text-sm text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {formData.tags.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange("tags", index, e.target.value)
                        }
                        placeholder={`Tag ${index + 1}`}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("tags", index)}
                      >
                        <FaTrash className="text-xs" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("tags")}
                  >
                    <FaPlus className="mr-2 text-xs" />
                    Add Tag
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {formData.thumbnail ? (
                      <img
                        src={formData.thumbnail}
                        alt="Course thumbnail preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FaImage className="text-3xl" />
                        <span className="text-xs">Thumbnail preview</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>

                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Publish Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Status</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="rounded-xl border bg-muted/50 p-4">
                    <p className="text-sm font-medium">Draft</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your course will be created as a draft. You can add
                      sections and lessons before submitting it for review.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Creating Course..."
                    ) : (
                      <>
                        <FaBookOpen className="mr-2" />
                        Create Course
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    You can edit your course after creating it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
