import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { diviningStreams } from "./divining-streams.ts";

/** @covers TLqUZgBeg7-a2 */
describe("Divining Streams — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: diviningStreams });
});
