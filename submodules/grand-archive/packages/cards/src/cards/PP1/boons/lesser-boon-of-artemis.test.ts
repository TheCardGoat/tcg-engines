import { describe } from "vitest";
import { lesserBoonOfArtemis } from "./lesser-boon-of-artemis.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers TlTFIRAoMr-a1
 * @covers TlTFIRAoMr-a2 */
describe("Lesser Boon of Artemis", () => {
  proveClassBoon(lesserBoonOfArtemis, "TAMER");
});
