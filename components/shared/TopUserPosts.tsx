import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "./QuestionCard";
import NotFound from "./NotFound";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
  userId: string;
  id: string | null;
}

const TopUserPosts = async ({ userId, id, searchParams }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });

  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {result.questions.length > 0 ? (
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            votes={question.upvotes}
            answers={question.answers}
            views={question.views}
            createdAt={question.createdAt}
            userId={id}
          />
        ))
      ) : (
        <NotFound
          title="There are no posts to show"
          href="/"
          btnText="Ask a Question"
          desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
        />
      )}

      <div className="mt-10">
        <Pagination
          isNext={result.isNextQuestions}
          pageNumber={searchParams?.page ? +searchParams.page : 1}
        />
      </div>
    </div>
  );
};

export default TopUserPosts;
