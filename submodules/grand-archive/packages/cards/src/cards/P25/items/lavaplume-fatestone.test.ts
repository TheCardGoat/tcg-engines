import { describe } from "vitest";
import { lavaplumeFatestone } from "./lavaplume-fatestone.ts";
import { proveReserveFatestoneTransform } from "../../../testing/reserve-fatestone-transform.ts";
/** @covers 0w5xyjuczy-a3 */
describe("lavaplume-fatestone — reserve transform", () =>
  proveReserveFatestoneTransform(lavaplumeFatestone, "0w5xyjuczy-a3", 4, false));
