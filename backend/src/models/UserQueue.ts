import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
	DataType
} from "sequelize-typescript";
import Queue from "./Queue";
import User from "./User";

@Table
class UserQueue extends Model<UserQueue> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserQueue;
