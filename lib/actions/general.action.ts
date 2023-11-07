"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { GetGlobalSearchedResult } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { Error } from "mongoose";

const searchableTypes = ["question", "answer", "user", "tag"];

export async function getGlobalSearchedResult(params: GetGlobalSearchedResult) {
  try {
    await connectToDatabase();

    const { searchQuery, type } = params;
    const regexQuery = { $regex: searchQuery, $options: "i" };

    let results: any = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // TO-DO: search everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${searchQuery}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.id
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Model info not found");
      }

      const queryResults = await modelInfo.model.find({
        [modelInfo.searchField]: regexQuery,
      });

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${searchQuery}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.id
            : type === "answer"
            ? item.question
            : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
