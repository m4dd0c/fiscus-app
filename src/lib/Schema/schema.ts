import { z } from "zod";

const transferSchema = z.object({
  sourceAccountId: z.string().min(2),
  destinationAccountId: z.string().min(15),
  amount: z.number().min(1),
});

export { transferSchema };
