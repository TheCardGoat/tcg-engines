import { describe } from "vitest";
import { primordialRitual } from "./primordial-ritual.ts";
import { proveMillResolution } from "../../../testing/mill-resolution.ts";

/** @covers 4mcnqsm3n9-a2 @covers 4mcnqsm3n9-a1 */
describe("primordial-ritual — mill", () => {
  proveMillResolution(primordialRitual, 2, "target", true);
});
