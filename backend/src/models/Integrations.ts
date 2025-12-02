import {
    Table,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    Default,
    DataType,
    HasMany,
    AutoIncrement,
    BelongsTo,
    ForeignKey,
    Column
} from "sequelize-typescript";
import Queue from "./Queue";
import Company from "./Company";

@Table
class Integrations extends Model<Integrations> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Company)
    @Column(DataType.INTEGER)
    companyId: number;
    @Column(DataType.TEXT)
    type: string;

    @Column
    @Column(DataType.TEXT)
    name: string;
    
    @Column(DataType.TEXT)
    projectName: string;
    
    @Column(DataType.TEXT)
    jsonContent: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isActive: boolean;
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
    dataValues: string | PromiseLike<string>;

    @Column(DataType.TEXT)
    token: string;

    @Column(DataType.TEXT)
    foneContact: string;

    @Column(DataType.TEXT)
    userLogin: string;

    @Column(DataType.TEXT)
    passLogin: string;

    @Column(DataType.INTEGER)
    initialCurrentMonth: number;
    @HasMany(() => Queue)
    queues: Queue[];
  
    @BelongsTo(() => Company)
    company: Company;
  
}

export default Integrations;