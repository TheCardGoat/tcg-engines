import { z } from "zod";

import { AnimationStepV2Schema } from "./steps.js";

export const AnimationPlanV2Schema = z
  .object({
    id: z.string().min(1),
    version: z.literal(2),
    steps: z.array(AnimationStepV2Schema).default([]),
  })
  .strict();

export type AnimationPlanV2 = z.infer<typeof AnimationPlanV2Schema>;
