"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const handleNavigation = (dr: string) => {
    const newPageNumber = dr === "prev" ? pageNumber - 1 : pageNumber + 1;

    router.push(`/page=${newPageNumber}`);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={pageNumber === 1}
      >
        <p
          className="body-medium text-dark200_light800"
          onClick={() => handleNavigation("prev")}
        >
          Prev
        </p>
      </Button>

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>

      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={!isNext}
      >
        <p
          className="body-medium text-dark200_light800"
          onClick={() => handleNavigation("next")}
        >
          Next
        </p>
      </Button>
    </div>
  );
};

export default Pagination;
