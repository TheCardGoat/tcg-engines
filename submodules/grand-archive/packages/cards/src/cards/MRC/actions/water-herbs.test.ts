import { describe } from "vitest";
import { waterHerbs } from "./water-herbs.ts";
import { proveMillResolution } from "../../../testing/mill-resolution.ts";

/** @covers 1lyk1dvdlh-a1 */
describe("water-herbs — mill", () => {
  proveMillResolution(waterHerbs, 2, "target");
});
