import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 text-center">Profile page</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[350px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>
      </div>
    );
  }