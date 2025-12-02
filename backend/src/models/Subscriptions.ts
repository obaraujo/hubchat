import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
		DataType
} from "sequelize-typescript";

@Table
class Subscriptions extends Model<Subscriptions> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    userPriceCents: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    whatsPriceCents: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    lastInvoiceUrl: string;

    @AllowNull(true)
    @Column(DataType.DATE)
    lastPlanChange: Date;

    @AllowNull(true)
    @Column(DataType.DATE)
    expiresAt: Date;

    @AllowNull(true)
    @Column(DataType.TEXT)
    providerSubscriptionId: string;

    @Column(DataType.INTEGER)
    companyId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}

export default Subscriptions;
