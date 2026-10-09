import { describe } from "vitest";
import { besiegedSlash } from "./besieged-slash.ts";
import { proveOpponentCountDiscount } from "../../../testing/opponent-count-discount.ts";
/** @covers Dkq7QnrGJI-a1 */
describe("besiegedSlash — opponent count discount", () => {
  proveOpponentCountDiscount(besiegedSlash, false);
});
