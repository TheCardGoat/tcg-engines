import { describe } from "vitest";
import { mistswornMagister } from "./mistsworn-magister.ts";
import { proveClassIntercept } from "../../../testing/class-intercept.ts";
/** @covers rqjnvhf26m-a1 */
describe("mistsworn-magister — Class Bonus Intercept", () =>
  proveClassIntercept(mistswornMagister, "rqjnvhf26m-a1"));

import { proveDelugeDeath } from "../../../testing/deluge-death.ts";
/** @covers rqjnvhf26m-a2 */
describe("mistswornMagister Deluge death trigger", () =>
  proveDelugeDeath(mistswornMagister, 3, 0, 2));
