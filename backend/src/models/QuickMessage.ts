import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
	DataType
} from "sequelize-typescript";

import Company from "./Company";
import User from "./User";

@Table
class QuickMessage extends Model<QuickMessage> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  shortcode: string;

  @Column(DataType.TEXT)
  message: string;

  @Column(DataType.TEXT)
  get mediaPath(): string | null {
    if (this.getDataValue("mediaPath")) {
      
      return `${process.env.BACKEND_URL}${process.env.PROXY_PORT ?`:${process.env.PROXY_PORT}`:""}/public/company${this.companyId}/quickMessage/${this.getDataValue("mediaPath")}`;

    }
    return null;
  }
  
  @Column(DataType.TEXT)
  mediaName: string;

  @Column(DataType.BOOLEAN)
  geral: boolean;
  
  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.BOOLEAN)
  visao: boolean;
}

export default QuickMessage;
