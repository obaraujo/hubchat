import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Queue from "./Queue";
import Company from "./Company";
import { DATE } from "sequelize";

@Table
class Prompt extends Model<Prompt> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  prompt: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  apiKey: string;

  @Column({ defaultValue: 10, type:DataType.INTEGER })
  maxMessages: number;

  @Column({ defaultValue: 100, type:DataType.INTEGER })
  maxTokens: number;

  @Column({ defaultValue: 1, type:DataType.INTEGER })
  temperature: number;

  @Column({ defaultValue: 0, type:DataType.INTEGER })
  promptTokens: number;

  @Column({ defaultValue: 0 , type:DataType.INTEGER})
  completionTokens: number;

  @Column({ defaultValue: 0, type:DataType.INTEGER })
  totalTokens: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  voice: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  voiceKey:string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  voiceRegion:string;

  @AllowNull
  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Prompt;
