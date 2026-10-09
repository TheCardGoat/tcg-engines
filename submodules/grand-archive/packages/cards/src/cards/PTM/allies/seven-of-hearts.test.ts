import { describe } from "vitest";
import { sevenOfHearts } from "./seven-of-hearts.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers nduIoPhZr1-a1 */
describe("Seven of Hearts — Kindle", () => {
  proveKindle(sevenOfHearts, 7);
});
