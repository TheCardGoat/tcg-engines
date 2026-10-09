import { describe } from "vitest";
import { jianyeDawnsKeep } from "./jianye-dawns-keep.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers 4ms1r3hjxp-a1 */
describe("Jianye, Dawn's Keep — Kindle", () => {
  proveKindle(jianyeDawnsKeep, 6);
});
