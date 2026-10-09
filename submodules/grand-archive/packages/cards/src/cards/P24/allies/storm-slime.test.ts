import { describe } from "vitest";
import { stormSlime } from "./storm-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers blqryebvwj-a1 */
describe("Storm Slime Pride", () => {
  provePrideAlly({ card: stormSlime, power: 3, pride: 3 });
});
