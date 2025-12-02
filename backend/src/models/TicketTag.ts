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
import Ticket from "./Ticket";

@Table({
  tableName: 'TicketTags'
})
class TicketTag extends Model<TicketTag> {
  @ForeignKey(() => Ticket)
  @Column(DataType.INTEGER)
  ticketId: number;

  @ForeignKey(() => Tag)
  @Column(DataType.INTEGER)
  tagId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @BelongsTo(() => Tag)
  tag: Tag;
}

export default TicketTag;
