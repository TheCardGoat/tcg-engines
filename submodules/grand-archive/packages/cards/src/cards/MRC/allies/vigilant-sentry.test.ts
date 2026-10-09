import { describe } from "vitest";
import { vigilantSentry } from "./vigilant-sentry.ts";

import { proveClassTaunt } from "../../../testing/class-taunt.ts";
/** @covers 72rfgveirp-a1 */
describe("vigilantSentry — class Taunt", () => {
  proveClassTaunt(vigilantSentry);
});
