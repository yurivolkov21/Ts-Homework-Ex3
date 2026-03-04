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
  async insertMany(docs: UserDoc[]): Promise<UserEntity[]> {
    if (docs.length === 0) return [];
    const res = await this.col().insertMany(docs);
    return docs.map((doc, i) => ({ ...doc, _id: res.insertedIds[i]! }));
  }

  async updateById(
    id: string,
    update: Partial<Pick<UserDoc, "email" | "passwordHash" | "role">>
  ): Promise<UserEntity | null> {
    const result = await this.col().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return result as UserEntity | null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.col().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
