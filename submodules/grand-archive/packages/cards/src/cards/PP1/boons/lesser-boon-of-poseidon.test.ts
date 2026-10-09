import { describe } from "vitest";
import { lesserBoonOfPoseidon } from "./lesser-boon-of-poseidon.ts";
import { proveElementBoon } from "../../../testing/element-boon.ts";
/** @covers xTY2LZ01o7-a1 */
describe("lesserBoonOfPoseidon enabled element", () => {
  proveElementBoon(lesserBoonOfPoseidon, "WATER");
});
