import { describe } from "vitest";
import { greaterBoonOfConnection } from "./greater-boon-of-connection.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers wc8IEEJUBL-a1 */
describe("Greater Boon of Connection — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfConnection, threshold: 2 });
});
