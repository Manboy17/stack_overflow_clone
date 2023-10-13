import React from "react";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-11 hidden flex-wrap gap-8 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.name}
          className={`
            body-medium
            rounded-lg
            px-6
            py-3
            capitalize
            shadow-none
            ${
              active === filter.value
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