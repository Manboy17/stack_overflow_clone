"use client";

import React, { useState } from "react";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const router = useRouter();
  const [clickedFilter, setClickedFilter] = useState(filter || "recommended");

  const handleTypeClick = (value: string) => {
    if (clickedFilter === value) {
      setClickedFilter("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.replace(newUrl, { scroll: false });
    } else {
      setClickedFilter(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value.toLowerCase(),
      });

      router.replace(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-11 hidden flex-wrap gap-8 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.name}
          onClick={() => handleTypeClick(filter.value)}
          className={`
            body-medium
            rounded-lg
            px-6
            py-3
            capitalize
            shadow-none
            ${
              clickedFilter === filter.value
                ? "bg-primary-100 text-primary-500"
                : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
            }
        `}
        >
          {filter.value}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
