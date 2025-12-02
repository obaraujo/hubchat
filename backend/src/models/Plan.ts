import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
	DataType
} from "sequelize-typescript";

@Table
class Plan extends Model<Plan> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.INTEGER)
  users: number;

  @Column(DataType.INTEGER)
  connections: number;

  @Column(DataType.INTEGER)
  queues: number;

  @Column(DataType.TEXT)
  amount: string;   

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

  @Column(DataType.BOOLEAN)
  useKanban: boolean;

  @Column(DataType.BOOLEAN)
  trial: boolean;

  @Column(DataType.INTEGER)
  trialDays: number;

  @Column(DataType.TEXT)
  recurrence: string;

  @Column(DataType.BOOLEAN)
  useOpenAi: boolean;

  @Column(DataType.BOOLEAN)
  useIntegrations: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isPublic: boolean;
}

export default Plan;
