import Link from "next/link";
import React from "react";
import Tag from "./navbar/Tag";
import Metric from "./Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  votes: number;
  answers: Array<object>;
  views: number;
  createdAt: Date;
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
}) => {
  console.log(tags);
  return (
    <div className="card-wrapper rounded-[11px] p-9 sm:p-11">
      <div
        className="
        flex
        flex-col
        items-start
        gap-5
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

        <div className="flex gap-2">
          {tags.map((item) => (
            <Tag key={item._id} _id={item._id} name={item.name} />
          ))}
        </div>

        <div className="flex-between mt-2 w-full flex-wrap gap-3">
          <Metric
            imgUrl="/assets/icons/avatar.svg"
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
            value={votes}
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
