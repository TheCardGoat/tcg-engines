import { describe } from "vitest";
import { rallyThePeasants } from "./rally-the-peasants.ts";
import { proveOpponentCountDiscount } from "../../../testing/opponent-count-discount.ts";
/** @covers q1uwq8sdbz-a1 */
describe("rallyThePeasants — opponent count discount", () => {
  proveOpponentCountDiscount(rallyThePeasants, true);
});

import { proveLookRevealAndReturn } from "../../../testing/look-reveal-and-return.ts";
import { eagerPage } from "../../DOA/allies/eager-page.ts";
/** @covers q1uwq8sdbz-a2 */
describe("Rally the Peasants — reveal Human from the top six", () => {
  proveLookRevealAndReturn(rallyThePeasants, 6, 3, [eagerPage]);
});
