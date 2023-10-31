"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const [search, setSearch] = useState("");
  const router = useRouter();

  // to-do: use effect debounce and pass formUrlQuery function imported from utils

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

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
          value={search}
          onChange={handleInputChange}
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
