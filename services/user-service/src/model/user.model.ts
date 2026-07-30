import { sequelize } from "@/db/sequelize";
import { DataTypes, Model } from "sequelize";

import type { User } from "@/types/user.types";
import { Optional } from "sequelize";

export type UserCreationAttribute = Optional<
  User,
  "id" | "createdAt" | "updatedAt"
>;

export class UserModel
  extends Model<User, UserCreationAttribute>
  implements User
{
  declare displayName: string;
  declare id: string;
  declare email: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);
