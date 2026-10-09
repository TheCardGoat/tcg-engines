import { describe } from "vitest";
import { shardOfEmpowerment } from "./shard-of-empowerment.ts";
import { proveBanishEmpower } from "../../../testing/banish-empower.ts";
/** @covers qqq8j5fxym-a1 */
describe("shard-of-empowerment — banish Empower", () =>
  proveBanishEmpower(shardOfEmpowerment, "qqq8j5fxym-a1", false));
