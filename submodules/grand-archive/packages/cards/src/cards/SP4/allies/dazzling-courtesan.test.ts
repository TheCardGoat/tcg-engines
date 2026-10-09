import { describe } from "vitest";
import { dazzlingCourtesan } from "./dazzling-courtesan.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers znk6g5o8ys-a1 */
describe("Dazzling Courtesan — Kindle", () => {
  proveKindle(dazzlingCourtesan, 3);
});
