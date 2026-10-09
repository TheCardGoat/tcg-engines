import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { backstep } from "./backstep.ts";

/** @covers sesw2ugmnm-a2 */
describe("backstep draw", () => {
  proveDrawCardResolution({ card: backstep, destination: "hand", targetOwnChampion: true });
});
