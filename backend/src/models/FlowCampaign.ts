import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Whatsapp from "./Whatsapp";

@Table({
  tableName: "FlowCampaigns"
})
export class FlowCampaignModel extends Model<FlowCampaignModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.INTEGER)
  flowId: number;

  @Column(DataType.TEXT)
  phrase: string;

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp

  @Column(DataType.BOOLEAN)
  status: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
