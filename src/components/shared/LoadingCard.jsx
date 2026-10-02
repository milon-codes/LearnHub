import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCard() {
  return (
    <div className="space-y-4 rounded-xl border p-4">
      <Skeleton className="h-40 w-full rounded-lg" />

      <Skeleton className="h-5 w-3/4" />

      <Skeleton className="h-4 w-1/2" />

      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
