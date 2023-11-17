"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface FilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter: React.FC<FilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get("filter");

  const handleTypeClick = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: value.toLowerCase(),
    });

    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleTypeClick}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`
            body-regular 
            light-border 
            background-light800_dark300 
            text-dark500_light700 
            border 
            px-5 
            py-2.5
            ${otherClasses}
        `}
        >
          <SelectValue
            className="line-clamp-1 flex-1 text-left"
            placeholder="Select a Filter"
          />
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular max-h-[300px] max-w-[250px] overflow-y-auto border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
