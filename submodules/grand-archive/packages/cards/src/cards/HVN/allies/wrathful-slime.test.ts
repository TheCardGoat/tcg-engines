import { describe } from "vitest";
import { wrathfulSlime } from "./wrathful-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers wjaq7t8vbf-a1 */
describe("Wrathful Slime Pride", () => {
  provePrideAlly({ card: wrathfulSlime, power: 1, pride: 4 });
});
