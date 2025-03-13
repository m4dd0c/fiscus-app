import { Client } from "dwolla-v2";

const dwollaClient = new Client({
  environment:
    (process.env.DWOLLA_ENV as "sandbox" | "production") || "sandbox",
  key: process.env.DWOLLA_CLIENT_ID as string,
  secret: process.env.DWOLLA_CLIENT_SECRET as string,
});

const DWOLLA_BASE_URL = process.env.DWOLLA_BASE_URL;

export { DWOLLA_BASE_URL, dwollaClient };
