import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Metric from "./Metric";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "./EditDeleteAction";

interface Props {
  key: string;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    id: string;
    name: string;
    picture: string;
  };
  votes: string[];
  createdAt: Date;
  userId: string | null;
}

const AnswerCard = ({
  key,
  _id,
  question,
  author,
  votes,
  createdAt,
  userId,
}: Props) => {
  const showEditDeleteAction = userId && userId === author.id;
  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className="card-wrapper rounded-[11px] p-9 sm:p-11"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span
            className="
          subtle-regular
          text-dark400_light700
          line-clamp-1
          flex
          sm:hidden
        "
          >
            {getTimestamp(createdAt)}
          </span>

          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        <SignedIn>
          {showEditDeleteAction && <EditDeleteAction id={_id} type="Answer" />}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="votes"
          value={formatAndDivideNumber(votes.length)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </Link>
  );
};

export default AnswerCard;
