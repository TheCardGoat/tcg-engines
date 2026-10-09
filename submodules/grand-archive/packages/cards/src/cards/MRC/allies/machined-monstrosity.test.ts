import { describe } from "vitest";
import { machinedMonstrosity } from "./machined-monstrosity.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 214upufooz-a1 */
describe("Machined Monstrosity Pride", () => {
  provePrideAlly({ card: machinedMonstrosity, power: 4, pride: 4 });
});
