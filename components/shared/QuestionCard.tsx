import Link from "next/link";
import React from "react";
import Tag from "./Tag";
import Metric from "./Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "./EditDeleteAction";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    id: string;
    name: string;
    picture: string;
  };
  votes: string[];
  answers: Array<object>;
  views: number;
  createdAt: Date;
  userId?: string | null;
}

const QuestionCard: React.FC<QuestionProps> = ({
  _id,
  title,
  tags,
  author,
  votes,
  answers,
  views,
  createdAt,
  userId,
}) => {
  const showEditDeleteAction = userId && userId === author.id;

  return (
    <div className="card-wrapper rounded-[11px] p-9 sm:p-11">
      <div
        className="
        flex
        flex-col-reverse
        items-start
        justify-between
        gap-5
        sm:flex-row
      "
      >
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
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showEditDeleteAction && (
            <EditDeleteAction type="Question" id={_id} />
          )}
        </SignedIn>
      </div>

      <div className="flex gap-2 py-4">
        {tags.map((item) => (
          <Tag key={item._id} _id={item._id} name={item.name} />
        ))}
      </div>

      <div className="flex-between mt-2 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="votes"
            value={formatAndDivideNumber(votes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
