import { describe } from "vitest";
import { direwolfAlpha } from "./direwolf-alpha.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 5n874ubgai-a1 */
describe("Direwolf Alpha Pride", () => {
  provePrideAlly({ card: direwolfAlpha, power: 2, pride: 2 });
});
