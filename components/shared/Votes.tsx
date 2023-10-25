"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isSaved?: boolean;
}

const Votes: React.FC<Props> = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  isUpvoted,
  isDownvoted,
  isSaved,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          isUpvoted,
          isDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          isUpvoted,
          isDownvoted,
          path: pathname,
        });
      }
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          isUpvoted,
          isDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          isUpvoted,
          isDownvoted,
          path: pathname,
        });
      }
    }
  };

  useEffect(() => {
    viewQuestion({
      userId: userId ? JSON.parse(userId) : undefined,
      questionId: JSON.parse(itemId),
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <Image
          src={
            isUpvoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"
          }
          alt="upvotes"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatAndDivideNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Image
          src={
            isDownvoted
              ? "/assets/icons/downvoted.svg"
              : "/assets/icons/downvote.svg"
          }
          alt="downvotes"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatAndDivideNumber(downvotes)}
          </p>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            isSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
