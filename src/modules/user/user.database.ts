import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";

export type UserEntity = UserDoc & { _id: ObjectId };

export class UserDatabase {
  private col() {
    return getDb().collection<UserDoc>("users");
  }
  async list(): Promise<Array<UserDoc & { _id: ObjectId }>> {
    return this.col().find({}).limit(50).toArray();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.col().findOne({ email }) as Promise<UserEntity | null>;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.col().findOne({
      _id: new ObjectId(id),
    }) as Promise<UserEntity | null>;
  }

  async create(doc: UserDoc): Promise<UserEntity> {
    const res = await this.col().insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  // Thêm InsertMany
}
