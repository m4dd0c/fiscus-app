import { PrismaClient } from "@prisma/client";

class PrismaService {
  private client: PrismaClient;
  private static instance: PrismaService;
  private constructor() {
    this.client = new PrismaClient();
  }
  static get getInstance() {
    if (!this.instance) this.instance = new PrismaService();
    return this.instance;
  }
  get getClient(): PrismaClient {
    return this.client;
  }
}

const instance = PrismaService.getInstance;
const prismaClient = instance.getClient;
export { instance, prismaClient };
