import { describe } from "vitest";
import { infernoSlime } from "./inferno-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 2vQVsdHJqI-a1 */
describe("Inferno Slime Pride", () => {
  provePrideAlly({ card: infernoSlime, power: 3, pride: 2 });
});
