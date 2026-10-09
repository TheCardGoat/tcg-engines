import { describe } from "vitest";
import { fluvialFatestone } from "./fluvial-fatestone.ts";

import { proveRetortCard } from "../../../testing/retort-card.ts";
/** @covers oo0p7gxtf3-a2 */
describe("fluvialFatestone Retort", () => proveRetortCard(fluvialFatestone, 2, "fluvial"));

import { proveEntryTargetStat } from "../../../testing/entry-target-stat.ts";
/** @covers 3h93tgm72l-a2 */
describe("fluvialFatestone entry stat effect", () =>
  proveEntryTargetStat(fluvialFatestone, "life"));
