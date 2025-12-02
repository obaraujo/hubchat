import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
	DataType
} from "sequelize-typescript";

@Table({
  tableName: "Partners"
})
class Partner extends Model<Partner> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  phone: string;

  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  document: string;

  @Column(DataType.INTEGER)
  commission: number;

  @Column(DataType.TEXT)
  typeCommission: string;

  @Column(DataType.TEXT)
  walletId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Partner;
