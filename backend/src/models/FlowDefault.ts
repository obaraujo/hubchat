import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";

@Table({
  tableName: "FlowDefaults"
})
export class FlowDefaultModel extends Model<FlowDefaultModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  flowIdWelcome: number;

  @Column(DataType.INTEGER)
  flowIdNotPhrase: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
