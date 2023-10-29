"use client";

import { deleteAnswer, deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  id: string;
}

const EditDeleteAction = ({ type, id }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = (id: string) => {
    router.push(`/question/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (type === "Question") {
      await deleteQuestion({ itemId: id, path: pathname });
    } else if (type === "Answer") {
      await deleteAnswer({ itemId: id, path: pathname });
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer"
          onClick={() => handleEdit(id)}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="trash"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={() => handleDelete(id)}
      />
    </div>
  );
};

export default EditDeleteAction;
