import Filter from "@/components/Filter";
import User from "@/components/shared/User";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { Link } from "lucide-react";
import React from "react";

const Community = async () => {
  const result = await getAllUsers({});

  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route="/community"
            iconPosition="left"
            iconUrl="/assets/icons/search.svg"
            otherClasses="flex-1"
            placeholder="Search by Username..."
          />
          <Filter
            filters={UserFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-5">
          {result.users.length > 0 ? (
            result.users.map((user) => <User key={user._id} user={user} />)
          ) : (
            <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
              <p>No users yet</p>
              <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
                Join to be the first!
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Community;
