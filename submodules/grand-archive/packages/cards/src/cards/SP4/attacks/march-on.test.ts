import { describe } from "vitest";
import { marchOn } from "./march-on.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers zuAmYGyCcL-a1 */
describe("March On — Command", () => {
  proveCommandAttack({ card: marchOn });
});
