import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  AutoIncrement,
  Default,
  BeforeCreate,
  BelongsToMany,
  AllowNull,
  DataType
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

import Contact from "./Contact";
import Message from "./Message";
import Queue from "./Queue";
import User from "./User";
import Whatsapp from "./Whatsapp";
import Company from "./Company";
import Tag from "./Tag";
import TicketTag from "./TicketTag";
import QueueIntegrations from "./QueueIntegrations";
import { format } from "date-fns";


@Table
class Ticket extends Model<Ticket> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ defaultValue: "pending", type:DataType.STRING })
  status: string;

  @Column(DataType.INTEGER)
  unreadMessages: number;

  @Column(DataType.BOOLEAN)
  flowWebhook: boolean;

  @Column(DataType.TEXT)
  lastFlowId: string;

  @Column(DataType.TEXT)
  hashFlowId: string;

  @Column(DataType.TEXT)
  flowStopped: string;

  @Column(DataType.JSON)
  dataWebhook: {} | null;;

  @Column(DataType.TEXT)
  lastMessage: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isGroup: boolean;

  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Contact)
  @Column(DataType.INTEGER)
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isBot: boolean;

  @HasMany(() => Message)
  messages: Message[];

  @HasMany(() => TicketTag)
  ticketTags: TicketTag[];

  @BelongsToMany(() => Tag, () => TicketTag)
  tags: Tag[];

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @Default(uuidv4())
  @Column(DataType.TEXT)
  uuid: string;

  @Default("whatsapp")
  @Column(DataType.TEXT)
  channel: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  amountUsedBotQueues: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  amountUsedBotQueuesNPS: number;

  @BeforeCreate
  static setUUID(ticket: Ticket) {
    ticket.uuid = uuidv4();
  }

  @Default(false)
  @Column(DataType.BOOLEAN)
  fromMe: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  sendInactiveMessage: boolean;

  @Column(DataType.DATE)
  lgpdSendMessageAt: Date;

  @Column(DataType.DATE)
  lgpdAcceptedAt: Date;

  @Column(DataType.DATE)
  imported: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isOutOfHour: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  useIntegration: boolean;

  @ForeignKey(() => QueueIntegrations)
  @Column(DataType.INTEGER)
  integrationId: number;

  @BelongsTo(() => QueueIntegrations)
  queueIntegration: QueueIntegrations;

  @Column(DataType.BOOLEAN)
  isActiveDemand: boolean;

  @Column(DataType.TEXT)
  typebotSessionId: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  typebotStatus: boolean

  @Column(DataType.DATE)
  typebotSessionTime: Date
}

export default Ticket;
