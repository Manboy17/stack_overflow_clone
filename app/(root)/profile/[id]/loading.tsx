import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-36 w-36 rounded-full" />

          <div className="mt-3">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="mt-3 h-7 w-20" />
            <Skeleton className="mt-3 h-7 w-32" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-10 w-24" />

        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-md" />
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-2">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-11 w-24" />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
