import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
	DataType
} from "sequelize-typescript";
import Queue from "./Queue";
import User from "./User";
import QueueIntegrations from "./QueueIntegrations";
import Files from "./Files";

@Table
class Chatbot extends Model<Chatbot> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  greetingMessage: string;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @BelongsTo(() => Queue, "queueId")
  queue: Queue;

  @ForeignKey(() => Chatbot)
  @Column(DataType.INTEGER)
  chatbotId: number;

  @Column(DataType.BOOLEAN)
  isAgent: boolean;

  @BelongsTo(() => Chatbot)
  mainChatbot: Chatbot;

  @HasMany(() => Chatbot)
  options: Chatbot[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.TEXT)
  queueType: string;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  optQueueId: number;

  @BelongsTo(() => Queue, "optQueueId")
  optQueue: Queue;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  optUserId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => QueueIntegrations)
  @Column(DataType.INTEGER)
  optIntegrationId: number;

  @BelongsTo(() => QueueIntegrations)
  queueIntegrations: QueueIntegrations;

  @ForeignKey(() => Files)
  @Column(DataType.INTEGER)
  optFileId: number;

  @BelongsTo(() => Files)
  file: Files;

  @Default(false)
  @Column(DataType.BOOLEAN)
  closeTicket: boolean;
}

export default Chatbot;
