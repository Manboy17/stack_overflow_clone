"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const openRef = useRef(null);
  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // @ts-ignore
      if (openRef.current && !openRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openRef, pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.replace(newUrl, { scroll: false });
      } else if (query) {
        const newUrl = removeUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["global", "type"],
        });

        router.replace(newUrl, { scroll: false });
      }

      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [router, search, searchParams, query]);

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={openRef}>
      <div
        className="
        background-light800_darkgradient 
        relative 
        flex 
        min-h-[56px] 
        grow 
        items-center 
        gap-1 
        rounded-xl 
        px-4"
      >
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          type="text"
          placeholder="Search globally"
          className="
            paragraph-regular 
            no-focus
            placeholder
            background-light800_darkgradient
            text-dark400_light700
            border-none
            shadow-none
            outline-none 
        "
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
