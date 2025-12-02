import { Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey, AutoIncrement, DataType, BelongsTo, ForeignKey, HasMany, AllowNull, Default } from "sequelize-typescript";

@Table
class ScheduledMessagesEnvio extends Model<ScheduledMessagesEnvio> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @Column(DataType.TEXT)
    mediaPath: string;

    @Column(DataType.TEXT)
    mediaName: string;

    @Column(DataType.TEXT)
    mensagem: string;

    @Column(DataType.INTEGER)
    companyId: number

    @Column(DataType.DATE)
    data_envio: Date;

    @Column(DataType.INTEGER)
    scheduledmessages: number;

    @Column(DataType.TEXT)
    key: string;

}

export default ScheduledMessagesEnvio;
