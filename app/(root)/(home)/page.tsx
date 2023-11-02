import Filter from "@/components/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import NotFound from "@/components/shared/NotFound";
import QuestionCard from "@/components/shared/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamsProps) {
  const result = await getQuestions({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          iconUrl="/assets/icons/search.svg"
          otherClasses="flex-1"
          placeholder="Search questions..."
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

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
            />
          ))
        ) : (
          <NotFound
            title="There’s no question to show"
            href="/ask-question"
            btnText="Ask a Question"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          />
        )}
      </div>

      <div className="mt-10">{/* <Pagination /> */}</div>
    </>
  );
}
