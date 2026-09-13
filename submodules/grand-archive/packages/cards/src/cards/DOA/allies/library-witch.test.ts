import { proveDeathDraw } from "../../../testing/death-draw.ts";
import { describe } from "vitest";
import { libraryWitch } from "./library-witch.ts";

/** @covers iD8qbpA8z5-a2 */
describe("Library Witch \u2014 resolution", () => {
  proveDeathDraw({ card: libraryWitch, abilityId: "iD8qbpA8z5-a2", classRestricted: false });
});
