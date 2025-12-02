import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
	DataType
} from "sequelize-typescript";
import Files from "./Files";

@Table({
  tableName: "FilesOptions"
})
class FilesOptions extends Model<FilesOptions> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Files)
  @Column(DataType.INTEGER)
  fileId: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  path: string;

  @Column(DataType.TEXT)
  mediaType: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Files)
  file: Files;
}

export default FilesOptions;
