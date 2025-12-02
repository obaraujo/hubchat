import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  ForeignKey,
	DataType
} from "sequelize-typescript";
import Company from "./Company";
import FilesOptions from "./FilesOptions";

@Table({
  tableName: "Files"
})
class Files extends Model<Files> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  message: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => FilesOptions)
  options: FilesOptions[];
}

export default Files;
