import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const ProfileEdit = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const user = (await getUserById({ userId }))?.toObject();
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-11 flex w-full flex-col gap-10">
        <Profile id={userId} user={user} />
      </div>
    </div>
  );
};

export default ProfileEdit;
