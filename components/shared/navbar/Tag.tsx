import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

interface TagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showTotalQuestions?: boolean;
}

const Tag: React.FC<TagProps> = ({
  _id,
  name,
  totalQuestions,
  showTotalQuestions,
}) => {
  return (
    <Link
      href={`/tags/${_id}`}
      className="flex w-full items-center justify-between"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showTotalQuestions && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default Tag;
