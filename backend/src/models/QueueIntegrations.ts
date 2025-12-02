import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    DataType,
    PrimaryKey,
    HasMany,
    AutoIncrement,
    BelongsTo,
    ForeignKey,
    Default
} from "sequelize-typescript";
import Queue from "./Queue";
import Company from "./Company";

@Table
class QueueIntegrations extends Model<QueueIntegrations> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.TEXT)
    type: string;

    @Column(DataType.TEXT)
    name: string;
    
    @Column(DataType.TEXT)
    projectName: string;
    
    @Column(DataType.TEXT)
    jsonContent: string;

    @Column(DataType.TEXT)
    urlN8N: string;

    @Column(DataType.TEXT)
    language: string;

    @CreatedAt
    @Column(DataType.DATE(6))
    createdAt: Date;

    @UpdatedAt
    @Column(DataType.DATE(6))
    updatedAt: Date;

    @ForeignKey(() => Company)
    @Column(DataType.INTEGER)
    companyId: number;
  
    @BelongsTo(() => Company)
    company: Company;
  
    @Column(DataType.TEXT)
    typebotSlug: string;

    @Default(0)
    @Column(DataType.INTEGER)
    typebotExpires: number;

    @Column(DataType.TEXT)
    typebotKeywordFinish: string;

    @Column(DataType.TEXT)
    typebotUnknownMessage: string;

    @Default(1000)
    @Column(DataType.INTEGER)
		typebotDelayMessage: number

    @Column(DataType.TEXT)
    typebotKeywordRestart: string;

    @Column(DataType.TEXT)
    typebotRestartMessage: string;
}

export default QueueIntegrations;