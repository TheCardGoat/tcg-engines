import { describe } from "vitest";
import { lesserBoonOfApollo } from "./lesser-boon-of-apollo.ts";
import { proveClassBoon } from "../../../testing/class-boon.ts";

/** @covers 9hA48XL1xV-a1
 * @covers 9hA48XL1xV-a2 */
describe("Lesser Boon of Apollo", () => {
  proveClassBoon(lesserBoonOfApollo, "RANGER");
});
