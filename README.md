## 简介

演示如何使用 Apollo Server 把知乎的 REST API 改造为 GraphQL API
另外还设计了用户登录和注册，关注知乎用户等 Mutation 操作

## 在线体验

https://w4u0q.sse.codesandbox.io/
`注意`：运行在 codesandbox 上，一段时间不用会自动休眠，打开的过程中需要稍微耐心等待初始化完成，如果出现错误，刷新再试一下就好了

## 示例

打开上面的在线体验网址之后，复制下面的查询到 Graphql Playground 执行即可，因为最终调用了知乎的 REST API，如果关联查询比较多，执行时间会比较常，需要耐心等待，我在对应的在线课程里会分析原因。

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
