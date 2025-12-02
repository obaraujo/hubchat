import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  BelongsTo,
	DataType
} from "sequelize-typescript";
import Tag from "./Tag";
import Contact from "./Contact";

@Table({
  tableName: "ContactTags"
})
class ContactTag extends Model<ContactTag> {
  @ForeignKey(() => Contact)
  @Column(DataType.INTEGER)
  contactId: number;

  @ForeignKey(() => Tag)
  @Column(DataType.INTEGER)
  tagId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @BelongsTo(() => Tag)
  tags: Tag;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ContactTag;
