import { describe } from "vitest";
import { capriciousLynx } from "./capricious-lynx.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers v1au7t9m4m-a1 */
describe("Capricious Lynx Pride", () => {
  provePrideAlly({ card: capriciousLynx, power: 3, pride: 4 });
});
