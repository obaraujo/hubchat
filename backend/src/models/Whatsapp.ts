import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  HasMany,
  Unique,
  BelongsToMany,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Queue from "./Queue";
import Ticket from "./Ticket";
import WhatsappQueue from "./WhatsappQueue";
import Company from "./Company";
import QueueIntegrations from "./QueueIntegrations";
import Prompt from "./Prompt";
import { FlowBuilderModel } from "./FlowBuilder";

@Table
class Whatsapp extends Model<Whatsapp> {
	[x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull
  @Unique
  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  session: string;

  @Column(DataType.TEXT)
  qrcode: string;

  @Column(DataType.TEXT)
  status: string;

  @Column(DataType.TEXT)
  battery: string;

  @Column(DataType.BOOLEAN)
  plugged: boolean;

  @Column(DataType.INTEGER)
  retries: number;

  @Column(DataType.TEXT)
  number: string;

  @Default("")
  @Column(DataType.TEXT)
  greetingMessage: string;

  @Column(DataType.TEXT)
  greetingMediaAttachment: string

  @Default("")
  @Column(DataType.TEXT)
  farewellMessage: string;

  @Default("")
  @Column(DataType.TEXT)
  complationMessage: string;

  @Default("")
  @Column(DataType.TEXT)
  outOfHoursMessage: string;

  @Column({ defaultValue: "stable", type:DataType.TEXT })
  provider: string;

  @Default(false)
  @AllowNull
  @Column(DataType.BOOLEAN)
  isDefault: boolean;

  @Default(false)
  @AllowNull
  @Column(DataType.BOOLEAN)
  allowGroup: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @BelongsToMany(() => Queue, () => WhatsappQueue)
  queues: Array<Queue & { WhatsappQueue: WhatsappQueue }>;

  @HasMany(() => WhatsappQueue)
  whatsappQueues: WhatsappQueue[];

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @Column(DataType.TEXT)
  token: string;

  @Column(DataType.TEXT)
  facebookUserId: string;

  @Column(DataType.TEXT)
  facebookUserToken: string;

  @Column(DataType.TEXT)
  facebookPageUserId: string;

  @Column(DataType.TEXT)
  tokenMeta: string;

  @Column(DataType.TEXT)
  channel: string;

  @Default(3)
  @Column(DataType.INTEGER)
  maxUseBotQueues: number;

  @Default(0)
  @Column(DataType.TEXT)
  timeUseBotQueues: string;

  @AllowNull(true)
  @Default(0)
  @Column(DataType.TEXT)
  expiresTicket: string;

  @Default(0)
  @Column(DataType.INTEGER)
  timeSendQueue: number;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  sendIdQueue: number;

  @BelongsTo(() => Queue)
  queueSend: Queue;

  @Column(DataType.TEXT)
  timeInactiveMessage: string;

  @Column(DataType.TEXT)
  inactiveMessage: string;

  @Column(DataType.TEXT)
  ratingMessage: string;

  @Column(DataType.INTEGER)
  maxUseBotQueuesNPS: number;

  @Column(DataType.INTEGER)
  expiresTicketNPS: number;

  @Column(DataType.TEXT)
  whenExpiresTicket: string;

  @Column(DataType.TEXT)
  expiresInactiveMessage: string;

  @Default("disabled")
  @Column(DataType.TEXT)
  groupAsTicket: string;
  
  @Column(DataType.DATE)
  importOldMessages: Date;

  @Column(DataType.DATE)
  importRecentMessages: Date;

  @Column(DataType.TEXT)
  statusImportMessages: string;
  
  @Column(DataType.BOOLEAN)
  closedTicketsPostImported:boolean;

  @Column(DataType.BOOLEAN)
  importOldMessagesGroups:boolean;

  @Column(DataType.INTEGER)
  timeCreateNewTicket: number;

  @ForeignKey(() => QueueIntegrations)
  @Column(DataType.INTEGER)
  integrationId: number;

  @BelongsTo(() => QueueIntegrations)
  queueIntegrations: QueueIntegrations;

  @Column({
    type: DataType.JSONB
  })
  schedules: [];

  @ForeignKey(() => Prompt)
  @Column(DataType.INTEGER)
  promptId: number;

  @BelongsTo(() => Prompt)
  prompt: Prompt;

  @Column(DataType.TEXT)
  collectiveVacationMessage: string;

  @Column(DataType.TEXT)
  collectiveVacationStart: string;

  @Column(DataType.TEXT)
  collectiveVacationEnd: string;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueIdImportMessages: number;

  @BelongsTo(() => Queue)
  queueImport: Queue;

  @ForeignKey(() => FlowBuilderModel)
  @Column(DataType.INTEGER)
  flowIdNotPhrase: number;

  @ForeignKey(() => FlowBuilderModel)
  @Column(DataType.INTEGER)
  flowIdWelcome: number;

  @BelongsTo(() => FlowBuilderModel)
  flowBuilder: FlowBuilderModel
}

export default Whatsapp;
