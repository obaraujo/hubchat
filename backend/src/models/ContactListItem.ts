import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
	DataType
} from "sequelize-typescript";
import Company from "./Company";
import ContactList from "./ContactList";

@Table({ tableName: "ContactListItems" })
class ContactListItem extends Model<ContactListItem> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  number: string;

  @AllowNull(false)
  @Default("")
  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.BOOLEAN)
  isWhatsappValid: boolean;

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

  @Column(DataType.BOOLEAN)
  isGroup: boolean;
}

export default ContactListItem;
