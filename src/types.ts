import { Connection } from "typeorm";
import { UserAPI } from "./datasources/user";
import ZhihuAPI from "./datasources/zhihu";
import { User } from "./entity/User";

export interface Context {
  connection: Connection;
  user?: User;
  dataSources?: {
    userAPI: UserAPI;
    zhihuAPI: ZhihuAPI;
  };
}

export interface People {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string;
  avatarUrlTemplate: string;
  isOrgination: boolean;
  type: string;
  headline: string;
  gender: number;
  followerCount: number;
  answerCount: number;
  articleCount: number;
}

export interface Question {
  id: string;
  createdAt: Date;
  title: string;
}

export interface Answer {
  id: string;
  createdAt: Date;
  authorId: string;
  excerpt: string;
  content: string;
  commentCount: number;
  voteupCount: number;
  questionId: string;
}

export interface Article {
  id: string;
  createdAt: Date;
  authorId: string;
  excerpt: string;
  content: string;
  commentCount: number;
  voteupCount: number;
  title: string;
  imageUrl: string | undefined;
}

export interface TopicFeedConnection {
  totalCount: number;
  pageInfo: PageInfo;
  feeds: Array<Article | Answer>;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: number;
  endCursor: number;
}

export interface Topic {
  id: string;
  questionsCount: number;
  name: string;
  introduction: string;
  followersCount: number;
  avatarUrl: string;
}
