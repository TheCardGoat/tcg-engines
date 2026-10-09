import { describe } from "vitest";
import { fatestoneOfRevelations } from "./fatestone-of-revelations.ts";
import { proveReserveFatestoneTransform } from "../../../testing/reserve-fatestone-transform.ts";
/** @covers xd4kv0akqr-a2 */
describe("fatestone-of-revelations — reserve transform", () =>
  proveReserveFatestoneTransform(fatestoneOfRevelations, "xd4kv0akqr-a2", 6, true));
