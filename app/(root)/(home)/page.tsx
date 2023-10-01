import Filter from "@/components/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import NotFound from "@/components/shared/NotFound";
import QuestionCard from "@/components/shared/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", label: "python" },
      { _id: "2", label: "sql" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john-doe.jpg",
    },
    votes: 1299,
    views: 500,
    answers: [],
    createdAt: new Date("2023-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "3", label: "css" },
      { _id: "4", label: "html" },
    ],
    author: {
      _id: "2",
      name: "Jane Smith",
      picture: "jane-smith.jpg",
    },
    votes: 5,
    views: 50,
    answers: [],
    createdAt: new Date("2023-06-02T10:30:00.000Z"),
  },
];

export default function Home() {
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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              votes={question.votes}
              answers={question.answers}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NotFound
            title="There’s no question to show"
            href="/"
            btnText="Ask a Question"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          />
        )}
      </div>
    </>
  );
}
