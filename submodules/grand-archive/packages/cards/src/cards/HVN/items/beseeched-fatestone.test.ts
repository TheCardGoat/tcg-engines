import { describe } from "vitest";
import { beseechedFatestone } from "./beseeched-fatestone.ts";
import { proveRestFatestoneTransform } from "../../../testing/rest-fatestone-transform.ts";
/** @covers x7t0vki9gy-a2 */
describe("Beseeched Fatestone transform cost", () =>
  proveRestFatestoneTransform(beseechedFatestone, "x7t0vki9gy-a2", 6, true));
