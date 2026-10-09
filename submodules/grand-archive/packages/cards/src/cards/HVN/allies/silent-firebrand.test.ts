import { describe } from "vitest";
import { silentFirebrand } from "./silent-firebrand.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers vwktc1c3kn-a1 */
describe("silentFirebrand Class Bonus Kindle", () =>
  proveKindle(silentFirebrand, 2, false, { classBonus: true }));
