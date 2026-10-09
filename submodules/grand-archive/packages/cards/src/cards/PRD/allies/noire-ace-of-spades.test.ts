import { describe } from "vitest";
import { noireAceOfSpades } from "./noire-ace-of-spades.ts";

import { twoOfHearts } from "../../DTR/allies/two-of-hearts.ts";
import { proveSupportedStealth } from "../../../testing/supported-stealth.ts";
/** @covers wbjc9t8ycp-a1 */
describe("noireAceOfSpades — supported Stealth", () => {
  proveSupportedStealth(noireAceOfSpades, twoOfHearts, false);
});
