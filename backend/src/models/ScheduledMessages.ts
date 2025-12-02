import { Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey, AutoIncrement, DataType, BelongsTo, ForeignKey, HasMany, AllowNull, Default } from "sequelize-typescript";
import Contact from "./Contact";
import Tag from "./Tag";

@Table
class ScheduledMessages extends Model<ScheduledMessages> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.DATE)
    data_mensagem_programada: Date;

    @Column(DataType.TEXT)
    id_conexao: String;

    @Column(DataType.TEXT)
    intervalo: string;

    @Column(DataType.TEXT)
    valor_intervalo: string;

    @Column(DataType.TEXT)
    mensagem: string;

    @Column(DataType.TEXT)
    tipo_dias_envio: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    mostrar_usuario_mensagem: boolean;

    @Default(false)
    @Column(DataType.BOOLEAN)
    criar_ticket: boolean;

    @Column({ type: DataType.JSONB })
    contatos: String[];

    @Column({ type: DataType.JSONB })
    tags: String[];

    @Column(DataType.INTEGER)
    companyId: number;

    @Column(DataType.TEXT)
    nome: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @Column(DataType.TEXT)
    mediaPath: string;

    @Column(DataType.TEXT)
    mediaName: string;

    @Column(DataType.TEXT)
    tipo_arquivo: string;

    @Column(DataType.TEXT)
    usuario_envio: string;

    @Column(DataType.TEXT)
    enviar_quantas_vezes: string;

}

export default ScheduledMessages;
