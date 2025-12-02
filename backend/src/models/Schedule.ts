import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
  Default
} from "sequelize-typescript";
import Company from "./Company";
import Contact from "./Contact";
import Ticket from "./Ticket";
import User from "./User";
import Whatsapp from "./Whatsapp";
import Queue from "./Queue";

@Table
class Schedule extends Model<Schedule> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  body: string;

  @Column(DataType.DATE)
  sendAt: Date;

  @Column(DataType.DATE)
  sentAt: Date;

  @ForeignKey(() => Contact)
  @Column(DataType.INTEGER)
  contactId: number;

  @ForeignKey(() => Ticket)
  @Column(DataType.INTEGER)
  ticketId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.STRING)
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Contact, "contactId")
  contact: Contact;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  ticketUserId: number;

  @BelongsTo(() => User, "ticketUserId")
  ticketUser: User;

  @ForeignKey(() => Queue)
  @Column(DataType.INTEGER)
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @Column({ defaultValue: "closed", type:DataType.TEXT })
  statusTicket: string;

  @Column({ defaultValue: "disabled", type:DataType.TEXT })
  openTicket: string;

  @Column(DataType.TEXT)
  mediaPath: string;

  @Column(DataType.TEXT)
  mediaName: string;

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @Column(DataType.INTEGER)
  intervalo: number;

  @Column(DataType.INTEGER)
  valorIntervalo: number;

  @Column(DataType.INTEGER)
  enviarQuantasVezes: number;

  @Column(DataType.INTEGER)
  tipoDias: number;

  @Column(DataType.INTEGER)
  contadorEnvio: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  assinar: boolean;
}

export default Schedule;
