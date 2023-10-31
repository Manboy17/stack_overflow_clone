"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(query || "");

  // to-do: use effect debounce and pass formUrlQuery function imported from utils

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(), // all existing queries
          key: "q", // we want to focus on the query (q in our case)
          value: search, // text user types in the input
        });

        router.push(newUrl, { scroll: false });
      } else if (pathname === route) {
        const newUrl = removeUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });

        router.push(newUrl, { scroll: false });
      }

      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [search, router, searchParams, pathname, route]);

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
