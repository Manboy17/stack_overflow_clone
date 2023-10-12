"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface LocalSearchProps {
  route: string;
  iconPosition: string;
  iconUrl: string;
  otherClasses: string;
  placeholder: string;
}

const LocalSearch: React.FC<LocalSearchProps> = ({
  route,
  iconPosition,
  iconUrl,
  otherClasses,
  placeholder,
}) => {
  return (
    <div className="relative w-full">
      <div
        className={`
        background-light800_darkgradient
        relative
        flex
        min-h-[56px]
        items-center
        gap-4
        rounded-[10px]
        px-4
        ${otherClasses}
        `}
      >
        {iconPosition === "left" && (
          <Image
            src={iconUrl}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          value=""
          onChange={() => {}}
          placeholder={placeholder}
          className="
            paragraph-regular 
            no-focus
            placeholder
            background-light800_darkgradient
            border-none
            shadow-none
            outline-none 
        "
        />

        {iconPosition === "right" && (
          <Image
            src={iconUrl}
            alt="search"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearch;
