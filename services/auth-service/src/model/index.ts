import { sequelize } from "@/db/sequelize";
import { RefreshToken } from "@/model/refresh-token.model";
import { UserCredentials } from "@/model/user-credentials.model";

export const initModel = async () => {
  await sequelize.sync();
  console.log("All models were synchronized successfully.");
};

export { RefreshToken, UserCredentials };
