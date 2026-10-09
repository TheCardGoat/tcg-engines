import { describe } from "vitest";
import { sinkIntoOblivion } from "./sink-into-oblivion.ts";
import { proveMillResolution } from "../../../testing/mill-resolution.ts";

/** @covers a8I89SP24E-a1 */
describe("sink-into-oblivion — mill", () => {
  proveMillResolution(sinkIntoOblivion, 3, "target");
});
