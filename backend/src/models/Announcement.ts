import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import Company from "./Company";

@Table
class Announcement extends Model<Announcement> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  priority: number; //1 - alta, 2 - média, 3 - baixa

  @Column(DataType.TEXT)
  title: string;

  @Column(DataType.TEXT)
  text: string;

  @Column (DataType.STRING)
  get mediaPath(): string | null {
    if (this.getDataValue("mediaPath")) {
      
      return `${process.env.BACKEND_URL}${process.env.PROXY_PORT ?`:${process.env.PROXY_PORT}`:""}/public/announcements/${this.getDataValue("mediaPath")}`;

    }
    return null;
  }

  @Column(DataType.TEXT)
  mediaName: string;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.BOOLEAN)
  status: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;
}

export default Announcement;
