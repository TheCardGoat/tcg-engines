import { describe } from "vitest";
import { flawlessSpiritOfMordred } from "./flawless-spirit-of-mordred.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers cXEI5vo6iG-a3 */
describe("Flawless Spirit of Mordred — draw before glimpse", () => {
  proveStartingGlimpse({ card: flawlessSpiritOfMordred, count: 4, draw: 7, drawFirst: true });
});
