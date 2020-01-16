import { RESTDataSource } from "apollo-datasource-rest";
import {
  People,
  Question,
  Answer,
  Topic,
  Article,
  PageInfo,
  TopicFeedConnection
} from "../types";

export class ZhihuAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://www.zhihu.com/api/v4/";
  }

  peopleReducer(people: any): People {
    return {
      id: people.id,
      slug: people.url_token,
      name: people.name,
      avatarUrl: people.avatar_url,
      avatarUrlTemplate: people.avatar_url_template,
      isOrgination: people.is_org,
      type: people.type,
      headline: people.headline,
      gender: people.gender,
      followerCount: people.follower_count,
      answerCount: people.answer_count,
      articleCount: people.articles_count
    };
  }

  questionReducer(question: any): Question {
    return {
      id: question.id,
      createdAt: new Date(question.created),
      title: question.title
    };
  }

  answerReducer(answer: any): Answer {
    return {
      id: answer.id,
      createdAt: new Date(
        answer.created ? answer.created : answer.created_time
      ),
      questionId: answer.question.id,
      authorId: answer.author.id,
      excerpt: answer.excerpt,
      content: answer.content,
      commentCount: answer.comment_count,
      voteupCount: answer.voteup_count
    };
  }

  articleReducer(article: any): Article {
    return {
      id: article.id,
      createdAt: new Date(article.created),
      title: article.title,
      authorId: article.author.id,
      excerpt: article.excerpt,
      content: article.content,
      commentCount: article.comment_count,
      voteupCount: article.voteup_count,
      imageUrl: article.image_url ? article.image_url : article.title_image
    };
  }

  topicReducer(topic: any): Topic {
    return {
      id: topic.id,
      questionsCount: topic.questions_count,
      name: topic.name,
      introduction: topic.introduction,
      followersCount: topic.followers_count,
      avatarUrl: topic.avatar_url
    };
  }

  async getTopFeedsByTopicId(
    id: string,
    limit: number = 3,
    offset: number = 0
  ): Promise<TopicFeedConnection> {
    console.log(`REST API: 'topics/${id}/feeds/top_activity'`);
    const include = `data[?(target.type=topic_sticky_module)].target.data[?(target.type=answer)].target.content,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=topic_sticky_module)].target.data[?(target.type=answer)].target.is_normal,comment_count,voteup_count,content,relevant_info,excerpt.author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=article)].target.content,voteup_count,comment_count,voting,author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=people)].target.answer_count,articles_count,gender,follower_count,is_followed,is_following,badge[?(type=best_answerer)].topics;data[?(target.type=answer)].target.annotation_detail,content,hermes_label,is_labeled,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=answer)].target.author.badge[?(type=best_answerer)].topics;data[?(target.type=article)].target.annotation_detail,content,hermes_label,is_labeled,author.badge[?(type=best_answerer)].topics;data[?(target.type=question)].target.annotation_detail,comment_count;`;
    const response = await this.get(
      `topics/${id}/feeds/top_activity?include=${include}&limit=${limit}&offset=${offset}`
    );
    const feeds = response.data.map((feed: any) => {
      if (feed.target.type === "answer") {
        return this.answerReducer(feed.target);
      } else {
        return this.articleReducer(feed.target);
      }
    });
    const pageInfo: PageInfo = {
      hasPreviousPage: !response.paging.is_start,
      hasNextPage: !response.paging.is_end,
      startCursor: offset,
      endCursor: limit + offset
    };
    const result: TopicFeedConnection = {
      totalCount: response.paging.totals,
      pageInfo,
      feeds
    };
    return result;
  }

  async getAnswersByQuestionId(
    id: string,
    limit: number = 3,
    offset: number = 0
  ) {
    console.log(`REST API: 'questions/${id}/answers'`);
    const include = `data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question,excerpt,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp,is_labeled,is_recognized,paid_info,paid_info_content;data[*].mark_infos[*].url;data[*].author.follower_count,badge[*].topics`;
    const response = await this.get(
      `questions/${id}/answers?include=${include}&limit=${limit}&offset=${offset}`
    );
    return response.data.map((answer: any) => {
      return this.answerReducer(answer);
    });
  }

  async getPeopleById(id: string): Promise<People> {
    console.log(`REST API: 'members/${id}'`);
    const include = `allow_message,is_followed,is_following,is_org,is_blocking,employments,answer_count,follower_count,articles_count,gender,badge[?(type=best_answerer)].topics`;
    const res = await this.get(`members/${id}?include=${include}`);
    return this.peopleReducer(res);
  }

  async getQuestionById(id: string): Promise<Question> {
    console.log(`REST API: 'questions/${id}'`);
    const res = await this.get(`questions/${id}`);
    return this.questionReducer(res);
  }

  async getAnswerById(id: string): Promise<Answer> {
    console.log(`REST API: 'answers/${id}'`);
    const include = `excerpt,content,comment_count,voteup_count`;
    const res = await this.get(`answers/${id}?include=${include}`);
    return this.answerReducer(res);
  }

  async getTopicById(id: string): Promise<Topic> {
    console.log(`REST API: 'topics/${id}'`);
    const res = await this.get(`topics/${id}`);
    return this.topicReducer(res);
  }

  async getArticleById(id: string): Promise<Article> {
    console.log(`REST API: 'articles/${id}'`);
    const res = await this.get(`articles/${id}`);
    return this.articleReducer(res);
  }
}

export default ZhihuAPI;
