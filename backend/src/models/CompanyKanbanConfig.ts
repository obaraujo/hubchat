import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Company from "./Company";

@Table
class CompanyKanbanConfig extends Model<CompanyKanbanConfig> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column({ unique: true })
  companyId: number;

  @AllowNull(true)
  @Column
  laneOrder: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;
}

export default CompanyKanbanConfig;
