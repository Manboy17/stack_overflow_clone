import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import React from "react";

const Loading = () => {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />

        <div className="hidden max-md:flex">
          <Skeleton className="h-14 w-28" />
        </div>
      </div>

      <div className="mt-11 hidden flex-wrap gap-8 md:flex">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
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
