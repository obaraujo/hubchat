import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
	DataType
} from "sequelize-typescript";
import CampaignShipping from "./CampaignShipping";
import Company from "./Company";
import ContactList from "./ContactList";
import Whatsapp from "./Whatsapp";
import User from "./User";
import Queue from "./Queue";

@Table({ tableName: "Campaigns" })
class Campaign extends Model<Campaign> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  name: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  message1: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  message2: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  message3: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  message4: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  message5: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  confirmationMessage1: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  confirmationMessage2: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  confirmationMessage3: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  confirmationMessage4: string;

  @Column({ defaultValue: "" , type: DataType.STRING})
  confirmationMessage5: string;

  @Column({ defaultValue: "INATIVA" , type: DataType.STRING})
  status: string; // INATIVA, PROGRAMADA, EM_ANDAMENTO, CANCELADA, FINALIZADA

  @Column(DataType.BOOLEAN)
  confirmation: boolean;

  @Column(DataType.TEXT)
  mediaPath: string;

  @Column(DataType.TEXT)
  mediaName: string;

  @Column(DataType.DATE)
  scheduledAt: Date;

  @Column(DataType.DATE)
  completedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => ContactList)
  @Column(DataType.INTEGER)
  contactListId: number;

  @BelongsTo(() => ContactList)
  contactList: ContactList;

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @HasMany(() => CampaignShipping)
  shipping: CampaignShipping[];

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @Column({ defaultValue: "closed" , type: DataType.STRING})
  statusTicket: string;

  @Column({ defaultValue: "disabled" , type: DataType.STRING})
  openTicket: string;
}

export default Campaign;
