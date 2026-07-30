import { sequelize } from "@/db/sequelize";
import { UserCredentials } from "@/model/user-credentials.model";
import { DataTypes, Model, type Optional } from "sequelize";

export interface RefreshTokenAttribute {
  id: string;
  userId: string;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
  updateAt: Date;
}

export type RefreshTokenCreationAttribute = Optional<
  RefreshTokenAttribute,
  "id" | "createdAt" | "updateAt"
>;

export class RefreshToken
  extends Model<RefreshTokenAttribute, RefreshTokenCreationAttribute>
  implements RefreshTokenAttribute
{
  declare id: string;
  declare userId: string;
  declare tokenId: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updateAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updateAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "refresh-tokens",
  },
);

UserCredentials.hasMany(RefreshToken, {
  foreignKey: "userId",
  as : "refreshTokens",
  onDelete : "CASCADE"
});

RefreshToken.belongsTo(UserCredentials, {
    foreignKey: "userId",
    as : "user"
})
