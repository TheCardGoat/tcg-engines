import { describe } from "vitest";
import { elysianTestSubject } from "./elysian-test-subject.ts";

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers 3DCP7WmBpx-a1 */
describe("elysian-test-subject — Elysian Aura", () => {
  proveElysianAura(elysianTestSubject);
});
