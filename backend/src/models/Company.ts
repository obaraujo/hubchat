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
  DataType,
  HasMany
} from "sequelize-typescript";
import Contact from "./Contact";
import Message from "./Message";

import Plan from "./Plan";
import Queue from "./Queue";
import Setting from "./Setting";
import Ticket from "./Ticket";
import TicketTraking from "./TicketTraking";
import User from "./User";
import UserRating from "./UserRating";
import Whatsapp from "./Whatsapp";
import CompaniesSettings from "./CompaniesSettings";
import Invoices from "./Invoices";

@Table
class Company extends Model<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  phone: string;

  @Column(DataType.TEXT)
  email: string;

  @Column({ defaultValue: "", type:DataType.TEXT })
  document: string;

  @Column({ defaultValue: "", type:DataType.TEXT })
  paymentMethod: string;

  @Column(DataType.DATE)
  lastLogin: Date;

  @Column(DataType.BOOLEAN)
  status: boolean;

  @Column(DataType.TEXT)
  dueDate: string;

  @Column(DataType.TEXT)
  recurrence: string;

  @Column({
    type: DataType.JSONB
  })
  schedules: [];

  @ForeignKey(() => Plan)
  @Column(DataType.INTEGER)
  planId: number;

  @BelongsTo(() => Plan)
  plan: Plan;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.TEXT)
  folderSize: string;

  @Column(DataType.TEXT)
  numberFileFolder: string;

  @Column(DataType.TEXT)
  updatedAtFolder: string;

  @HasMany(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  users: User[];

  @HasMany(() => UserRating, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  userRatings: UserRating[];

  @HasMany(() => Queue, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  queues: Queue[];

  @HasMany(() => Whatsapp, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  whatsapps: Whatsapp[];

  @HasMany(() => Message, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  messages: Message[];

  @HasMany(() => Contact, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  contacts: Contact[];

  @HasMany(() => Setting, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  settings: Setting[];

  @HasMany (() => CompaniesSettings, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  companieSettings: CompaniesSettings;

  @HasMany(() => Ticket, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  tickets: Ticket[];

  @HasMany(() => TicketTraking, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  ticketTrankins: TicketTraking[];

  @HasMany(() => Invoices, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  invoices: Invoices[];
}

export default Company;
