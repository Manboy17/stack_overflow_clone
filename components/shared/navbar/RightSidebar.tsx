import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "./Tag";

const topQuestions = [
  {
    _id: 1,
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    _id: 2,
    title: "Can I get the course for free?",
  },
  {
    _id: 3,
    title: "Redux Toolkit Not Updating State as Expected",
  },
  {
    _id: 4,
    title: "How do I use express as a custom server in NextJS?",
  },
  {
    _id: 5,
    title: "Async/Await Function Not Handling Errors Properly",
  },
];

const popularTags = [
  {
    _id: 1,
    name: "NEXT.JS",
    totalQuestions: 3,
  },
  {
    _id: 2,
    name: "JAVASCRIPT",
    totalQuestions: 5,
  },
  {
    _id: 3,
    name: "NODE.JS",
    totalQuestions: 1,
  },
  {
    _id: 4,
    name: "PYTHON",
    totalQuestions: 9,
  },
  {
    _id: 5,
    name: "TAILWIND.CSS",
    totalQuestions: 5,
  },
];

const RightSidebar = () => {
  return (
    <div
      className="
        background-light900_dark200
        light-border
        sticky
        right-0
        top-0
        flex
        h-screen
        flex-col
        p-6
        pt-36
        shadow-light-300
        dark:shadow-none
        max-xl:hidden
        lg:w-[350px]
    "
    >
      <div
        className="
            flex
            flex-col
            gap-6
        "
      >
        <h1 className="h3-bold text-dark200_light900">Hot Network</h1>
        {topQuestions.map((item) => (
          <Link
            href={`/questions/${item._id}`}
            key={item._id}
            className="flex w-full items-center justify-between gap-7"
          >
            <p className="body-medium text-dark500_light700">{item.title}</p>
            <Image
              src="/assets/icons/chevron-right.svg"
              alt="chevron right"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
        ))}
      </div>

      <div className="mt-[60px] flex flex-col gap-6">
        <h1 className="h3-bold text-dark200_light900 mb-3">Popular Tags</h1>
        {popularTags.map((item) => (
          <Tag
            key={item._id}
            _id={item._id}
            name={item.name}
            totalQuestions={item.totalQuestions}
            showTotalQuestions
          />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
