import { SkeletonPage } from "@/components/ui/Skeleton";
import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <SkeletonPage />
    </>
  );
}
