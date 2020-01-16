import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar URL
  scalar Date

  type Query {
    me: User!
    people(id: ID!): People!
    topic(id: ID!): Topic!
    question(id: ID!): Question!
    answer(id: ID!): Answer!
    article(id: ID!): Article!
  }

  type Mutation {
    login(email: String!, password: String!): String!
    followPeople(peopleId: ID!): User!
  }

  type User {
    id: ID!
    email: String!
  }

  type People {
    id: ID!
    slug: String!
    name: String!
    avatarUrl(size: AvatarSize = SMALL): URL!
    isOrgination: Boolean!
    type: String!
    headline: String
    gender: Gender!
    followerCount: Int!
    answerCount: Int!
    articlesCount: Int!
  }

  enum Gender {
    FEMALE
    MALE
    UNKNOWN
  }

  enum AvatarSize {
    SMALL
    LARGE
    EXTRA_LARGE
  }

  type Topic {
    id: ID!
    questionsCount: Int!
    name: String!
    introduction: String
    followersCount: Int!
    avatarUrl: URL
    topFeeds(first: Int, after: Int): TopicFeedConnection!
  }

  type TopicFeedConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    feeds: [TopicFeed!]!
  }

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: Int
    endCursor: Int
  }

  type Question {
    id: ID!
    createdAt: Date
    title: String
    answers(limit: Int, offset: Int): [Answer!]!
  }

  interface TopicFeed {
    id: ID!
    createdAt: Date!
    author: People!
    title: String!
    excerpt: String!
    content: String!
    commentCount: Int!
    voteupCount: Int!
  }

  type Answer implements TopicFeed {
    id: ID!
    createdAt: Date!
    author: People!
    title: String!
    excerpt: String!
    content: String!
    commentCount: Int!
    voteupCount: Int!
    question: Question!
  }

  type Article implements TopicFeed {
    id: ID!
    createdAt: Date!
    title: String!
    author: People!
    excerpt: String!
    content: String!
    commentCount: Int!
    voteupCount: Int!
    imageUrl: URL
  }
`;
