import { describe } from "vitest";
import { goldenCheckmate } from "./golden-checkmate.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers KbE9R1mi3n-a1 */
describe("Golden Checkmate — Command", () => {
  proveCommandAttack({ card: goldenCheckmate });
});
