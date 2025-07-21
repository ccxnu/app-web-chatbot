import { z } from "zod";

export const moduleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  active: z.boolean(),
});

export type ModuleModel = z.infer<typeof moduleSchema>;
export const moduleListSchema = z.array(moduleSchema);
