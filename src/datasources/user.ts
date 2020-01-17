import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Context } from "../types";
import { User } from "../entity/User";
import { ApolloError } from "apollo-server";
import * as bcrypt from "bcrypt";
import { Follow } from "../entity/Follow";

export class UserAPI extends DataSource {
  context: Context;

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config: DataSourceConfig<Context>) {
    this.context = config.context;
  }

  async findOrCreateUser(email: string, password: string): Promise<User> {
    let userRepository = this.context.connection.getRepository(User);
    let user = await userRepository.findOne({ email });
    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        throw new ApolloError("Incorrect passowrd");
      }
      return user;
    }
    const hash = await bcrypt.hash(password, 10);
    user = userRepository.create({
      email,
      password: hash
    });
    await userRepository.save(user);
    return user;
  }

  async followPeople(peopleId: string) {
    const currentUser = this.context.user;
    if (!currentUser) {
      throw new ApolloError("login required");
    }
    let followRepository = this.context.connection.getRepository(Follow);
    let follow = await followRepository.findOne({
      userId: currentUser.id,
      zhihuPeopleId: peopleId
    });
    if (!follow) {
      follow = followRepository.create({
        userId: currentUser.id,
        zhihuPeopleId: peopleId
      });
      await followRepository.save(follow);
    }
  }

  async unFollowPeople(peopleId: string) {
    const currentUser = this.context.user;
    if (!currentUser) {
      throw new ApolloError("login required");
    }
    let followRepository = this.context.connection.getRepository(Follow);
    let follow = await followRepository.findOne({
      userId: currentUser.id,
      zhihuPeopleId: peopleId
    });
    if (follow) {
      await followRepository.delete(follow.id);
    }
  }

  async isFollowing(peopleId: string): Promise<boolean> {
    const currentUser = this.context.user;
    if (!currentUser) {
      return false;
    }
    let followRepository = this.context.connection.getRepository(Follow);
    let follow = await followRepository.findOne({
      userId: currentUser.id,
      zhihuPeopleId: peopleId
    });
    if (!follow) {
      return false;
    }
    return true;
  }
}
