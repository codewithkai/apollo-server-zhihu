## 简介

演示如何使用 Apollo Server 把知乎的 REST API 改造为 GraphQL API
另外还设计了用户登录和注册，关注知乎用户等 Mutation 操作

## 示例

查询一个问题、关联查询问题的答案以及答案的作者

```graphql
{
  question(id: "357653771") {
    title
    answers {
      excerpt
      voteupCount
      commentCount
      author {
        name
      }
    }
  }
}
```

查询一个知乎用户

```graphql
{
  people(id: "c7e4de899635e9ce839d90d64f0b9602") {
    name
    avatarUrl(size: LARGE)
    headline
    followerCount
    answerCount
  }
}
```

查询一个话题，关联查询热门讨论

```graphql
{
  topic(id: "20031262") {
    name
    followersCount
    topFeeds {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      feeds {
        __typename
        title
        excerpt
        voteupCount
        commentCount
        ... on Article {
          imageUrl
        }
      }
    }
  }
}
```
