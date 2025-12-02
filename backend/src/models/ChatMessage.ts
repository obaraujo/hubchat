import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
	DataType
} from "sequelize-typescript";
import User from "./User";
import Chat from "./Chat";

@Table({ tableName: "ChatMessages" })
class ChatMessage extends Model<ChatMessage> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Chat)
  @Column(DataType.INTEGER)
  chatId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  senderId: number;

  @Column({ defaultValue: "" , type:DataType.STRING})
  message: string;

  @Column(DataType.TEXT)
  mediaPath: string;

  @Column(DataType.TEXT)
  mediaName: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Chat)
  chat: Chat;

  @BelongsTo(() => User)
  sender: User;
}

export default ChatMessage;
