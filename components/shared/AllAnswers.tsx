import { getAllAnswers } from "@/lib/actions/answer.action";
import React from "react";
import Filter from "../Filter";
import { QuestionFilters } from "@/constants/filters";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParsedHTML from "./ParsedHTML";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
}

const AllAnswers: React.FC<Props> = async ({
  questionId,
  userId,
  totalAnswers,
}) => {
  const result = await getAllAnswers({ questionId });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={QuestionFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex w-full flex-col-reverse gap-5 sm:flex-row">
                <Link
                  href={`/profile/${answer.author.id}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt="avatar"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p>{answer.author.name}</p>

                    <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                      - answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">VOTING</div>
              </div>
            </div>

            <ParsedHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
