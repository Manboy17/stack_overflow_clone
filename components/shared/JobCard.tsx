import Image from "next/image";
import Link from "next/link";
import React from "react";

const JobCard = () => {
  return (
    <div className="card-wrapper flex flex-col gap-6 rounded-[12px] p-9 sm:flex-row sm:p-11">
      <div className="flex justify-end sm:hidden">
        <div className="background-light800_dark400 flex items-center gap-2 rounded-2xl px-3 py-1.5">
          <Image
            src="/assets/icons/avatar.svg"
            alt="flag"
            width={16}
            height={16}
            className="rounded-full"
          />
          <p className="body-medium text-dark400_light700">LA, US</p>
        </div>
      </div>
      <div className="flex items-center">
        <Image
          src="/assets/images/site-logo.svg"
          alt="image"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">Posting Link</p>
          <div className="hidden sm:flex">
            <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
              <Image
                src="/assets/icons/avatar.svg"
                alt="flag"
                width={16}
                height={16}
                className="rounded-full"
              />
              <p className="body-medium text-dark400_light700">LA, US</p>
            </div>
          </div>
        </div>
        <p className="body-regular text-dark500_light700  mt-2 line-clamp-2">
          Undefined Posting Link CardWorks Servicing, 225 W Station Square
          Drive, Pittsburgh, Pennsylvania, United States of America Req
          Wednesday, September 6, 2023 CardWorks Servicing
        </p>
        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/clock.svg"
                alt="clock"
                width={20}
                height={20}
              />
              <p className="body-medium uppercase text-light-500">Fulltime</p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/currency-dollar-circle.svg"
                alt="dollar"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <p className="body-semibold primary-text-gradient">View job</p>
            <Image
              src="/assets/icons/arrow-up-right.svg"
              alt="arrow-up-right"
              width={23}
              height={23}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

// {/* <div className="flex w-full">
//   <Image
//     src="/assets/images/site-logo.svg"
//     alt="image"
//     width={64}
//     height={64}
//     className="object-contain"
//   />

//   <div className="flex w-full justify-between">
//     <span className="base-semibold text-dark200_light900">
//       -- New Orleans, LA
//     </span>
//     <div className="hidden sm:flex">
//       <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
//         <Image
//           src="/assets/icons/avatar.svg"
//           alt="flag"
//           width={16}
//           height={16}
//           className="rounded-full"
//         />
//         <p className="body-medium text-dark400_light700">
//           New Orlends, LA, US
//         </p>
//       </div>
//     </div>
//   </div>
// </div> */}
