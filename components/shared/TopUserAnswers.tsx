import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import NotFound from "./NotFound";
import Pagination from "./Pagination";
import AnswerCard from "./AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  id: string | null;
}

const TopUserAnswers = async ({ userId, id, searchParams }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {result.answers.length > 0 ? (
        result.answers.map((item) => (
          <AnswerCard
            key={item._id}
            _id={item._id}
            question={item.question}
            author={item.author}
            votes={item.upvotes}
            createdAt={item.createdAt}
            userId={id}
          />
        ))
      ) : (
        <NotFound
          title="There are no answers to show"
          href="/"
          btnText="Ask a Question"
          desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
        />
      )}

      <div className="mt-10">
        <Pagination
          isNext={result.isNext}
          pageNumber={searchParams?.page ? +searchParams.page : 1}
        />
      </div>
    </div>
  );
};

export default TopUserAnswers;
