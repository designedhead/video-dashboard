import type { Categories, Plugin, Post, Software, User } from "@prisma/client";
import { type Overwrite } from "./helps";

export type ParsedPost = Overwrite<
  Post,
  {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    categories: Categories[];
    softwareType: Software[];
    plugins: Plugin[];
    author: User;
  }
>;
