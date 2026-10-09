import { describe } from "vitest";
import { aeneanCrystallization } from "./aenean-crystallization.ts";
import { proveRestedAllyDestruction } from "../../../testing/rested-ally-destruction.ts";
/** @covers YDjxpBd8Fm-a2
 * @covers YDjxpBd8Fm-a3 */
describe("Aenean Crystallization — rested target and conditional Fractal", () => {
  proveRestedAllyDestruction(aeneanCrystallization, "one-with-fractal");
});
