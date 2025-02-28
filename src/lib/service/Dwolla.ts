import axios from "axios";

const DWOLLA_BASE_URL = process.env.DWOLLA_BASE_URL;
const DWOLLA_CLIENT_ID = process.env.DWOLLA_CLIENT_ID;
const DWOLLA_CLIENT_SECRET = process.env.DWOLLA_CLIENT_SECRET;

// find customers
export async function findDwollaCustomer(email: string) {
 try {
  const accessToken = await getDwollaAccessToken();

  const response = await axios.get(
   `${DWOLLA_BASE_URL}/customers?email=${email}`,
   {
    headers: {
     Authorization: `Bearer ${accessToken}`,
     Accept: "application/vnd.dwolla.v1.hal+json",
    },
   }
  );

  const customers = response.data._embedded?.customers;
  if (customers && customers.length > 0) {
   console.log("Customer already exists:", customers[0]._links.self.href);
   return customers[0]._links.self.href; // Return existing customer URL
  }

  return null; // No customer found
 } catch (error: any) {
  console.error(
   "Error searching for customer:",
   error.response?.data || error.message
  );
  return null;
 }
}

// Get Dwolla OAuth Token
async function getDwollaAccessToken() {
 try {
  const response = await axios.post(
   `${DWOLLA_BASE_URL}/token`,
   new URLSearchParams({ grant_type: "client_credentials" }),
   {
    auth: { username: DWOLLA_CLIENT_ID!, password: DWOLLA_CLIENT_SECRET! },
    headers: {
     "Content-Type": "application/x-www-form-urlencoded",
    },
   }
  );
  return response.data.access_token;
 } catch (error: any) {
  console.log(error?.message, error?.response?.data);
 }
}

// Create Dwolla Customer

export async function createDwollaCustomer(
 email: string,
 firstName: string,
 lastName: string
) {
 try {
  // First, check if the customer already exists
  const existingCustomerUrl = await findDwollaCustomer(email);
  if (existingCustomerUrl) return existingCustomerUrl; // Return existing customer URL

  const accessToken = await getDwollaAccessToken();

  const response = await axios.post(
   `${DWOLLA_BASE_URL}/customers`,
   { firstName, lastName, email, type: "personal" },
   {
    headers: {
     Authorization: `Bearer ${accessToken}`,
     Accept: "application/vnd.dwolla.v1.hal+json",
     "Content-Type": "application/json",
    },
   }
  );

  console.log("Customer created:", response.headers["location"]);
  return response.headers["location"];
 } catch (error: any) {
  console.error("Dwolla API Error:", error.response?.data || error.message);
  throw new Error(
   error.response?.data?.message || "Failed to create Dwolla customer"
  );
 }
}
// Function to check if the funding source already exists
async function findFundingSource(customerUrl: string, accountNumber: string) {
 try {
  const accessToken = await getDwollaAccessToken();
  const response = await axios.get(`${customerUrl}/funding-sources`, {
   headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.dwolla.v1.hal+json",
   },
  });

  const fundingSources = response.data._embedded?.["funding-sources"] || [];
  console.log(accountNumber);
  console.log(
   { self: fundingSources._link.self, customer: fundingSources._link.customer },
   "fs"
  );
  const existingSource = fundingSources.find(
   (fs: any) => fs.accountNumber === accountNumber  // accountNumber is not a key in fs
  );

  return existingSource ? existingSource._links.self.href : null;
 } catch (error: any) {
  console.error("Error checking funding sources:", error?.response?.data);
  return null;
 }
}

// Updated function to add funding source only if it doesn't exist
export async function addFundingSource(customerUrl: string, account: any) {
 try {
  const existingFundingSource = await findFundingSource(
   customerUrl,
   account.account
  );
  console.log("existingFUndingSource", existingFundingSource, customerUrl);
  if (existingFundingSource) {
   console.log("Funding source already exists:", existingFundingSource);
   return existingFundingSource;
  }

  const accessToken = await getDwollaAccessToken();
  const response = await axios.post(
   `${customerUrl}/funding-sources`,
   {
    bankAccountType: account.subtype,
    name: account.name,
    accountNumber: account.account,
    routingNumber: account.routing,
    type: "checking",
   },
   {
    headers: {
     Authorization: `Bearer ${accessToken}`,
     "Content-Type": "application/json",
     Accept: "application/vnd.dwolla.v1.hal+json",
    },
   }
  );

  console.log("Funding source created:", response.headers["location"]);
  return response.headers["location"];
 } catch (error: any) {
  console.error("Dwolla API Error:", error?.response?.data || error?.message);
  throw new Error(
   error.response?.data?.message || "Failed to add funding source"
  );
 }
}

// Transfer Funds
export async function transferFunds(
 fromFundingSource: string,
 toFundingSource: string,
 amount: number
) {
 try {
  const accessToken = await getDwollaAccessToken();

  const response = await axios.post(
   `${DWOLLA_BASE_URL}/transfers`,
   {
    _links: {
     source: { href: fromFundingSource },
     destination: { href: toFundingSource },
    },
    amount: { currency: "USD", value: amount.toFixed(2) },
   },
   {
    headers: {
     Authorization: `Bearer ${accessToken}`,
     "Content-Type": "application/json",
     Accept: "application/vnd.dwolla.v1.hal+json",
    },
   }
  );
  return response.headers["location"];
 } catch (error: any) {
  console.log(error?.response?.data, error?.message, "is erorr");
 }
}
