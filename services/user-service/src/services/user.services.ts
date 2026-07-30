import { sequelize } from "@/db";

import { UserRepository, userRepository } from "@/respositories/user.repo";
import { createUserInput, User } from "@/types/user.types";

import { AuthUserRegisteredPayload, HttpError } from "@chatapp/common";
import { UniqueConstraintError } from "sequelize";

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserById(id:string): Promise<User> {
   const user = await this.repository.findById(id)
   if (!user) {
      throw new HttpError(404, 'User not found')
   }

   return user;
  }

  async getAllUsers(): Promise<User[]>{
     return this.repository.findAll()
  }

    async createUser(input: createUserInput) : Promise<User>  {
       try{
        const user = await this.repository.create(input)

        //TODO: PUBLISH USER CREATED EVENT

        return user
       }catch(error){
          if(error instanceof UniqueConstraintError) {
            throw new HttpError(409, `User already exists`)
          }
          throw error
       }
    }

    async searchUsers(params : {
      query: string,
      limit?:number,
      excludeIds?: string[],
    }): Promise<User[]>{
      
       const query = params.query.trim()
       const limit = params.limit || 10
       const excludeIds = params.excludeIds || []
       
       if(!query){
         throw new HttpError(400, 'Query is required')
       }

       if(query.trim().length < 2){
         throw new HttpError(400, 'Query must be at least 2 characters long')
       }
       
       return this.repository.searchByQuery(query, {limit, excludeIds})
    }

  async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User> {
    const user = await this.repository.upsertFromAuthEvent(payload);
    
    //TODO: PUBLISH USER CREATED EVENT
    
    return user;
  }
}

export const userService = new UserService(userRepository);
