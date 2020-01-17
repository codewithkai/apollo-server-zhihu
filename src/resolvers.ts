import { Context, People, Topic, Question, Answer, Article } from "./types";
import * as jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server";

export const resolvers = {
  Mutation: {
    async login(
      parent: null,
      args: { email: string; password: string },
      context: Context
    ): Promise<string> {
      const user = await context.dataSources.userAPI.findOrCreateUser(
        args.email,
        args.password
      );
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          userId: user.id
        },
        "secret"
      );
      return token;
    },
    async followPeople(
      parent: null,
      args: { peopleId: string },
      context: Context
    ) {
      await context.dataSources.userAPI.followPeople(args.peopleId);
      return context.dataSources.zhihuAPI.getPeopleById(args.peopleId);
    },
    async unFollowPeople(
      parent: null,
      args: { peopleId: string },
      context: Context
    ) {
      await context.dataSources.userAPI.unFollowPeople(args.peopleId);
      return context.dataSources.zhihuAPI.getPeopleById(args.peopleId);
    }
  },
  Query: {
    me(parent: null, args: {}, context: Context) {
      if (!context.user) {
        throw new ApolloError("login required");
      }
      return context.user;
    },
    people(
      parent: null,
      args: { id: string },
      context: Context
    ): Promise<People> {
      return context.dataSources.zhihuAPI.getPeopleById(args.id);
    },
    topic(
      parent: null,
      args: { id: string },
      context: Context
    ): Promise<Topic> {
      return context.dataSources.zhihuAPI.getTopicById(args.id);
    },
    question(
      parent: null,
      args: { id: string },
      context: Context
    ): Promise<Question> {
      return context.dataSources.zhihuAPI.getQuestionById(args.id);
    },
    answer(
      parent: null,
      args: { id: string },
      context: Context
    ): Promise<Answer> {
      return context.dataSources.zhihuAPI.getAnswerById(args.id);
    },
    article(
      parent: null,
      args: { id: string },
      context: Context
    ): Promise<Article> {
      return context.dataSources.zhihuAPI.getArticleById(args.id);
    }
  },
  People: {
    avatarUrl(parent: People, args: { size: string }): string {
      const sizeMap = {
        SMALL: "s",
        LARGE: "l",
        EXTRA_LARGE: "xl"
      };
      return parent.avatarUrlTemplate.replace(`{size}`, sizeMap[args.size]);
    },
    isFollowing(parent: People, args: {}, context: Context) {
      return context.dataSources.userAPI.isFollowing(parent.id);
    }
  },
  Question: {
    answers(
      parent: Question,
      args: { limit: number; offset: number },
      context: Context
    ) {
      return context.dataSources.zhihuAPI.getAnswersByQuestionId(
        parent.id,
        args.limit,
        args.offset
      );
    }
  },
  Topic: {
    topFeeds(
      parent: Topic,
      args: { limit: number; offset: number },
      context: Context
    ) {
      return context.dataSources.zhihuAPI.getTopFeedsByTopicId(
        parent.id,
        args.limit,
        args.offset
      );
    }
  },
  Answer: {
    async title(parent: Answer, args: {}, context: Context) {
      const question = await context.dataSources.zhihuAPI.getQuestionById(
        parent.questionId
      );
      return question.title;
    },

    question(parent: Answer, args: {}, context: Context) {
      return context.dataSources.zhihuAPI.getQuestionById(parent.questionId);
    },
    author(parent: Answer, args: {}, context: Context) {
      return context.dataSources.zhihuAPI.getPeopleById(parent.authorId);
    }
  },
  Article: {
    author(parent: Article, args: {}, context: Context) {
      return context.dataSources.zhihuAPI.getPeopleById(parent.authorId);
    }
  },

  TopicFeed: {
    __resolveType(topicFeed: any) {
      if (topicFeed.questionId) {
        return "Answer";
      } else {
        return "Article";
      }
    }
  },
  Gender: {
    FEMALE: 0,
    MALE: 1,
    UNKNOWN: -1
  }
};
