import { describe } from "vitest";
import { etherealAbsorption } from "./ethereal-absorption.ts";

import { proveDrawAndPrepare } from "../../../testing/draw-and-prepare.ts";
/** @covers 4zEOAaLdap-a1
 * @covers 4zEOAaLdap-a2
 */
describe("etherealAbsorption draw and preparation", () => {
  proveDrawAndPrepare(etherealAbsorption, 1, 2, "regalia");
});
