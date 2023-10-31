import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(120),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
// eslint-disable-next-line no-redeclare
// export type QuestionsSchema = z.infer<typeof QuestionsSchema>;

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  portfolioLink: z.string().url().optional().or(z.literal("")),
  userLocation: z.string().min(3).max(25).optional().or(z.literal("")),
  bio: z.string().min(10).max(100).optional().or(z.literal("")),
});
