import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    Default,
    AutoIncrement,
		DataType
} from "sequelize-typescript";

@Table
class ApiUsages extends Model<ApiUsages> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Default(0)
    @Column(DataType.INTEGER)
    companyId: number;

    @Default(null)
    @Column(DataType.TEXT)
    dateUsed: string;

    @Default(0)
    @Column(DataType.INTEGER)
    UsedOnDay: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedText: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedPDF: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedImage: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedVideo: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedOther: number;

    @Default(0)
    @Column(DataType.INTEGER)
    usedCheckNumber: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
    dataValues: string | PromiseLike<string>;

}

export default ApiUsages;
