import { formatAndDivideNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";

import Image from "next/image";
import React from "react";

interface BadgeStageProps {
  imageUrl: string;
  value: number;
  title: string;
}

const BadgeStage = ({ imageUrl, value, title }: BadgeStageProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imageUrl} alt="badge status" width={40} height={50} />
      <div className="flex flex-col items-start">
        <p className="paragraph-semibold text-dark200_light900">
          {formatAndDivideNumber(value)}
        </p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  reputation: number;
  badges: BadgeCounts;
}  

const Stats = ({ totalQuestions, totalAnswers, reputation, badges }: Props) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        Stats - {reputation}
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="flex flex-col items-start">
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <BadgeStage
          imageUrl="/assets/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />
        <BadgeStage
          imageUrl="/assets/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />
        <BadgeStage
          imageUrl="/assets/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
