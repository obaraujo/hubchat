import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    AllowNull,
    HasMany,
    Unique,
		DataType
} from "sequelize-typescript";
import Company from "./Company";

@Table({ tableName: "Invoices" })
class Invoices extends Model<Invoices> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Company)
    @Column(DataType.INTEGER)
    companyId: number;

    @Column(DataType.TEXT)
    dueDate: string;

    @Column(DataType.TEXT)
    detail: string;

    @Column(DataType.TEXT)
    status: string;

    @Column(DataType.INTEGER)
    value: number;

    @Column(DataType.INTEGER)
    users: number;
  
    @Column(DataType.INTEGER)
    connections: number;
  
    @Column(DataType.INTEGER)
    queues: number;
  
    @Column(DataType.BOOLEAN)
    useWhatsapp: boolean;   
  
    @Column(DataType.BOOLEAN)
    useFacebook: boolean;   
  
    @Column(DataType.BOOLEAN)
    useInstagram: boolean;   
    
    @Column(DataType.BOOLEAN)
    useCampaigns: boolean;   
  
    @Column(DataType.BOOLEAN)
    useSchedules: boolean;   
  
    @Column(DataType.BOOLEAN)
    useInternalChat: boolean;   
    
    @Column(DataType.BOOLEAN)
    useExternalApi: boolean;   

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @Column(DataType.TEXT)
    linkInvoice: string;
}

export default Invoices;
