import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  Default,
  ForeignKey,
  DataType,
  AllowNull,
  AutoIncrement
} from "sequelize-typescript";
import Company from "./Company";
import Whatsapp from "./Whatsapp";

@Table
class BaileysChats extends Model<BaileysChats> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  jid: string;

  @Column(DataType.INTEGER)
  conversationTimestamp: number;

  @Default(0)
  @Column(DataType.INTEGER)
  unreadCount: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: string;
}

export default BaileysChats;
