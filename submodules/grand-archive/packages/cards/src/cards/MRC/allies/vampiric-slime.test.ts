import { describe } from "vitest";
import { vampiricSlime } from "./vampiric-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 597fqr67du-a1 */
describe("Vampiric Slime Pride", () => {
  provePrideAlly({ card: vampiricSlime, power: 2, pride: 3 });
});
