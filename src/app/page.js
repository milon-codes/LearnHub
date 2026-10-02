import Hero from "@/components/home/Hero";
import PopularCourses from "@/components/home/PopularCourses";
import Categories from "@/components/home/Categories";
import TopInstructors from "@/components/home/TopInstructors";
import WhyLearnHub from "@/components/home/WhyLearnHub";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularCourses />
      <Categories />
      <TopInstructors />
      <WhyLearnHub />
      <CTA />
    </>
  );
}
