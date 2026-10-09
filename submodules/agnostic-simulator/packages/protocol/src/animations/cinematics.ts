import { z } from "zod";

/** Presentation only. Games supply resolved targets and outcomes; effects add no rules. */
export const CinematicStyleSchema = z.enum([
  "projectile",
  "volley",
  "beam",
  "chain",
  "burst",
  "wave",
  "sweep",
  "shield",
  "tether",
  "drain",
  "heal",
  "aura",
  "dissolve",
  "summon",
]);

export type CinematicStyle = z.infer<typeof CinematicStyleSchema>;
