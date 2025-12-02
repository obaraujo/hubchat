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
  tableName: "FlowBuilders"
})
export class FlowBuilderModel extends Model<FlowBuilderModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.INTEGER)
  company_id: number;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.JSON)
  flow: {} | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
