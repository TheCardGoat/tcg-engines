import { describe } from "vitest";
import { seedOfEmpowerment } from "./seed-of-empowerment.ts";
import { proveBanishEmpower } from "../../../testing/banish-empower.ts";
/** @covers XbYtI0XtVH-a1 @covers XbYtI0XtVH-a2 */
describe("seed-of-empowerment — banish Empower", () =>
  proveBanishEmpower(seedOfEmpowerment, "XbYtI0XtVH-a2", true));
