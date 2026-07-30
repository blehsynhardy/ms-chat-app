import { sequelize } from "@/db/sequelize";
import { DataTypes, Model, type Optional } from "sequelize";

export interface UserCredentialAttribute {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserCredentialCreationAttribute = Optional<
  UserCredentialAttribute,
  "id" | "createdAt" | "updatedAt"
>;

export class UserCredentials
  extends Model<UserCredentialAttribute, UserCredentialCreationAttribute>
  implements UserCredentialAttribute
{
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare displayName: string;
  declare createdAt: Date;
  declare updatedAt?: Date | undefined;
}

UserCredentials.init({
    id : {
        type: DataTypes.UUID,
        primaryKey : true,
        defaultValue : DataTypes.UUIDV4
    },

    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        validate : {
            isEmail : true
        }
    },

    passwordHash : {
        type : DataTypes.STRING,
        allowNull : false
    },

    displayName : {
        type : DataTypes.STRING,
        allowNull : false
    },

    createdAt : {
        type : DataTypes.DATE,
        allowNull : false,
        defaultValue : DataTypes.NOW
    },

    updatedAt : {
        type : DataTypes.DATE,
        allowNull : false,
        defaultValue : DataTypes.NOW
    }
}, {
    sequelize,
    tableName : "user_credentials",
})