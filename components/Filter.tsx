"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

interface FilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses: string;
  containerClasses: string;
}

const Filter: React.FC<FilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
}) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
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
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.name} value={filter.name} className="">
                {filter.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
