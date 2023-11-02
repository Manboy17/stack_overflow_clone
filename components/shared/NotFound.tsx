import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface NotFoundProps {
  title: string;
  href: string;
  btnText: string;
  desc: string;
}

const NotFound: React.FC<NotFoundProps> = ({ title, href, btnText, desc }) => {
  return (
    <div className="mt-[112px] flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="not found light"
        width={300}
        height={300}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="not found light"
        width={300}
        height={300}
        className="hidden object-contain dark:flex"
      />
      <h1 className="h2-bold text-dark200_light900 mt-8">{title}</h1>
      <p
        className="
        body-regular
        text-dark500_light700
        my-3.5
        max-w-md
        text-center
      "
      >
        {desc}
      </p>
      <Link href={href}>
        <Button
          className="
            paragraph-medium
            mt-2
            min-h-[46px]
            rounded-lg
            bg-primary-500
            px-4
            py-3
            text-light-900
            hover:bg-primary-500
            dark:bg-primary-500
            dark:text-light-900
        "
        >
          {btnText}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
