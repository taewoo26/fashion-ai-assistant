import { Catalog } from "@/components/Catalog";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <Catalog />
      <HowItWorks />
    </>
  );
}
