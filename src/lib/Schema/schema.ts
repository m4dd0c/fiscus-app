import { z } from "zod";

const transferSchema = z.object({
 from: z.string().min(2),
 to: z.string().min(15),
 amount: z.number().min(1),
});

export { transferSchema };
