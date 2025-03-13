import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export const config = new Configuration({
  basePath:
    PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
    },
  },
});

// singleton pattern
class PlaidService {
  private static instance: PlaidService;
  private client: PlaidApi;

  private constructor(config: Configuration) {
    this.client = new PlaidApi(config);
  }

  static getInstance(config: Configuration): PlaidService {
    if (!this.instance) {
      this.instance = new PlaidService(config);
    }
    return this.instance;
  }

  getClient(): PlaidApi {
    return this.client;
  }
}

const plaidService = PlaidService.getInstance(config);
const plaidClient = plaidService.getClient();

export { plaidClient, plaidService };
