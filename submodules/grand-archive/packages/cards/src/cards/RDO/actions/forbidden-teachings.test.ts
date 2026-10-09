import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { forbiddenTeachings } from "./forbidden-teachings.ts";

/** @covers yp4poEZtHt-a2 */
describe("forbiddenTeachings draw", () => {
  proveDrawCardResolution({ card: forbiddenTeachings, destination: "hand" });
});
