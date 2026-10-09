import { describe } from "vitest";
import { lesserBoonOfNotus } from "./lesser-boon-of-notus.ts";
import { proveElementBoon } from "../../../testing/element-boon.ts";
/** @covers bFoUoGdZBX-a1 */
describe("lesserBoonOfNotus enabled element", () => {
  proveElementBoon(lesserBoonOfNotus, "WIND");
});
