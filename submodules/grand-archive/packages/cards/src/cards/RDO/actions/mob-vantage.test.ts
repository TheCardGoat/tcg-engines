import { describe } from "vitest";
import { mobVantage } from "./mob-vantage.ts";
import { proveOpponentCountDiscount } from "../../../testing/opponent-count-discount.ts";
/** @covers bBI0TC54pV-a1 */
describe("mobVantage — opponent count discount", () => {
  proveOpponentCountDiscount(mobVantage, false);
});
