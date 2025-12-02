/** 
 * @TercioSantos-0 |
 * model/CompaniesSettings |
 * @descrição:modelo para tratar as configurações das empresas 
 */
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
    Default,
		DataType
  } from "sequelize-typescript";
  import Company from "./Company";
 
  
  @Table({ tableName: "CompaniesSettings" })
  class CompaniesSettings extends Model<CompaniesSettings> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Company)
    @Column(DataType.INTEGER)
    companyId: number;
  
    @BelongsTo(() => Company)
    company: Company;
  
    @Column(DataType.TEXT)
    hoursCloseTicketsAuto: string;

    @Column(DataType.TEXT)
    chatBotType: string;

    @Column(DataType.TEXT)
    acceptCallWhatsapp: string;

    //inicio de opções: enabled ou disabled
    @Column(DataType.TEXT)
    userRandom: string; 

    @Column(DataType.TEXT)
    sendGreetingMessageOneQueues: string; 

    @Column(DataType.TEXT)
    sendSignMessage: string; 

    @Column(DataType.TEXT)
    sendFarewellWaitingTicket: string; 

    @Column(DataType.TEXT)
    userRating: string; 

    @Column(DataType.TEXT)
    sendGreetingAccepted: string; 

    @Column(DataType.TEXT)
    CheckMsgIsGroup: string; 

    @Column(DataType.TEXT)
    sendQueuePosition: string; 

    @Column(DataType.TEXT)
    scheduleType: string; 

    @Column(DataType.TEXT)
    acceptAudioMessageContact: string; 

    @Column(DataType.TEXT)
    sendMsgTransfTicket: string;

    @Column(DataType.TEXT)
    enableLGPD: string; 

    @Column(DataType.TEXT)
    requiredTag: string; 

    @Column(DataType.TEXT)
    lgpdDeleteMessage: string; 

    @Column(DataType.TEXT)
    lgpdHideNumber: string; 

    @Column(DataType.TEXT)
    lgpdConsent: string;

		@Column(DataType.TEXT)
		lgpdLink: string

    //fim de opções: enabled ou disabled 
    @Column(DataType.TEXT)
    lgpdMessage: string

    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;

    @Default(false)
    @Column(DataType.BOOLEAN)
    DirectTicketsToWallets: boolean;

    @Default(false)
    @Column(DataType.BOOLEAN)
    closeTicketOnTransfer: boolean;

    @Column(DataType.TEXT)
    transferMessage: string

    @Column(DataType.TEXT)
    greetingAcceptedMessage: string

    @Column(DataType.TEXT)
    AcceptCallWhatsappMessage: string

    @Column(DataType.TEXT)
    sendQueuePositionMessage: string

    @Column(DataType.BOOLEAN)
    showNotificationPending: boolean;
  }
  
  export default CompaniesSettings;