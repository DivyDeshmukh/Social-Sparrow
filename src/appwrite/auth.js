import config from "../config/config";
import { Client, Account, ID } from "appwrite"

class AuthService {
    client = new Client();
    account;

    constructor () {
        this.client
            .setEndpoint(config.appwrite_url)
            .setProject(config.appwrite_project_Id);

        this.account = new Account (this.client);
    }

    async createAccount ({name, email, password}) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                // perform login if account successfully created
                return await this.login({email, password});
            }

        } catch (error) {
            console.log('Appwrite Service :: createAccount :: Error: ', error);
            throw error;
            // it will throw error to the nearest catch block in the stack
        }
    }

    async login ({email, password}) {
      
        try {
            console.log(email, password);
            const session = await this.account.createEmailSession(
                email,
                password
            );

            if (session) {
                return session;
            }
        } catch (error) {
            console.log('Appwrite Service :: login :: Error: ', error);
            throw error;
        }
    }

    async logout () {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log('Appwrite Service :: logout :: Error: ', error);
        }
    }

    async getCurrentUser () {
        try {
            // gets currently logged in user
            const currentUser = await this.account.get();
            if (currentUser) return currentUser;
        } catch (error) {
            console.log('Appwrite Service :: getCurrentUser :: Error: ', error);
        }
    }

}

const authService = new AuthService();

export default authService;

