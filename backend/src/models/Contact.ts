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
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
	DataType
} from "sequelize-typescript";
import ContactCustomField from "./ContactCustomField";
import Ticket from "./Ticket";
import Company from "./Company";
import Schedule from "./Schedule";
import ContactTag from "./ContactTag";
import Tag from "./Tag";
import ContactWallet from "./ContactWallet";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class Contact extends Model<Contact> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  number: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  email: string;

  @Default("")
  @Column(DataType.TEXT)
  profilePicUrl: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isGroup: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  disableBot: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  acceptAudioMessage: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @Default("whatsapp")
  @Column(DataType.TEXT)
  channel: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @HasMany(() => ContactCustomField)
  extraInfo: ContactCustomField[];

  @HasMany(() => ContactTag)
  contactTags: ContactTag[];

  @BelongsToMany(() => Tag, () => ContactTag)
  tags: Tag[];

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Schedule, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  schedules: Schedule[];

  @Column(DataType.TEXT)
  remoteJid: string;

  @Column(DataType.DATE)
  lgpdAcceptedAt: Date;

  @Column(DataType.BOOLEAN)
  pictureUpdated: boolean;

  @Column(DataType.STRING)
  get urlPicture(): string | null {
    if (this.getDataValue("urlPicture")) {
      
      return this.getDataValue("urlPicture") === 'nopicture.png' ?   `${process.env.FRONTEND_URL}/nopicture.png` :
      `${process.env.BACKEND_URL}${process.env.PROXY_PORT ?`:${process.env.PROXY_PORT}`:""}/public/company${this.companyId}/contacts/${this.getDataValue("urlPicture")}` 

    }
    return null;
  }

  @BelongsToMany(() => User, () => ContactWallet, "contactId", "walletId")
  wallets: ContactWallet[];

  @HasMany(() => ContactWallet)
  contactWallets: ContactWallet[];

  @ForeignKey(() => Whatsapp)
  @Column(DataType.INTEGER)
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;
}

export default Contact;
