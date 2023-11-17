import Filter from "@/components/Filter";
import JobCard from "@/components/shared/JobCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getAllCountries } from "@/utils";
import React from "react";

const Jobs = async () => {
  const countries = await getAllCountries();

  const countryFilters = countries?.data.map((country: any) => ({
    name: country.name.common,
    value: country.name.common,
  }));

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/jobs"
          iconPosition="left"
          iconUrl="/assets/icons/search.svg"
          otherClasses="flex-1"
          placeholder="Job Title, Company or Keywords"
        />
        <Filter
          filters={countryFilters}
          otherClasses="min-h-[56px] sm:min-w-[220px]"
        />
      </div>

      <div className="mt-12 flex w-full flex-col gap-6">
        <JobCard />
        <JobCard />
      </div>
    </div>
  );
};

export default Jobs;
