import Filter from "@/components/Filter";
import NotFound from "@/components/shared/NotFound";
import TagCard from "@/components/shared/TagCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import React from "react";

const Tags = async () => {
  const allTags = await getAllTags({});

  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route="/community"
            iconPosition="left"
            iconUrl="/assets/icons/search.svg"
            otherClasses="flex-1"
            placeholder="Search by tag name..."
          />
          <Filter
            filters={TagFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-5">
          {allTags.tags.length > 0 ? (
            allTags.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
          ) : (
            <NotFound
              title="No Tags Found!"
              desc="It looks line there are no tags found!"
              href="/ask-question"
              btnText="Ask a question"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Tags;
