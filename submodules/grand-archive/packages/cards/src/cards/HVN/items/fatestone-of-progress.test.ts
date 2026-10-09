import { describe } from "vitest";
import { fatestoneOfProgress } from "./fatestone-of-progress.ts";
import { proveReserveFatestoneTransform } from "../../../testing/reserve-fatestone-transform.ts";
/** @covers 2sn7hlyrkw-a2 */
describe("fatestone-of-progress — reserve transform", () =>
  proveReserveFatestoneTransform(fatestoneOfProgress, "2sn7hlyrkw-a2", 4, false));
