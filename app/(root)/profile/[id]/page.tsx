import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDateFormatted } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import TopUserPosts from "@/components/shared/TopUserPosts";
import TopUserAnswers from "@/components/shared/TopUserAnswers";

const Profile = async ({ params, searchParams }: URLProps) => {
  const { userId: id } = auth();
  const result = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {result?.user.picture && (
            <Image
              src={result.user.picture}
              alt="user avatar"
              width={140}
              height={140}
              className="rounded-full object-cover"
            />
          )}

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {result?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{result?.user.username}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-start gap-5">
              {result?.user.portfolioLink && (
                <ProfileLink
                  image="/assets/icons/link.svg"
                  href={result?.user.portfolioLink}
                  title="Portfolio"
                />
              )}
              {result?.user.userLocation && (
                <ProfileLink
                  image="/assets/icons/location.svg"
                  title={result?.user.userLocation}
                />
              )}
              <ProfileLink
                image="/assets/icons/calendar.svg"
                title={`Joined ${getJoinedDateFormatted(
                  result?.user.joinDate
                )}`}
              />
            </div>

            {result?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {result?.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {id === result.user.id && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={result.totalQuestions}
        totalAnswers={result.totalAnswers}
        reputation={result.reputation}
        badges={result.badgeCounts}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <TopUserPosts
              userId={result.user._id.toString()}
              searchParams={searchParams}
              id={id}
            />
          </TabsContent>
          <TabsContent value="answers">
            <TopUserAnswers
              userId={result.user._id.toString()}
              searchParams={searchParams}
              id={id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
