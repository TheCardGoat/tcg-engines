import { describe } from "vitest";

import { proveLoadBow } from "../../../testing/load-bow.ts";
import { savageArrow } from "./savage-arrow.ts";

/** @covers uuty5scwug-a1 */
describe("Savage Arrow — load", () => {
  proveLoadBow({ card: savageArrow, abilityId: "uuty5scwug-a1" });
});
