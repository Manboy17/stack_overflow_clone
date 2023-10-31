import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "../Tag";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
  const questions = await getTopQuestions();
  const tags = await getTopTags();

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
        {questions.map((item) => (
          <Link
            href={`/question/${item._id}`}
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
        {tags.map((item) => (
          <Tag
            key={item._id}
            _id={item._id}
            name={item.name}
            totalQuestions={item.numberOfQuestions}
            showTotalQuestions
          />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
