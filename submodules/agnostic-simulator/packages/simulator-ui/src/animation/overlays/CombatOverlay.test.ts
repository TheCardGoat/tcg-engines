import { describe, expect, it } from "vite-plus/test";

import { combatOverlayStyle } from "./CombatOverlay";

describe("combatOverlayStyle", () => {
  it("distinguishes declaration, blocking, and impact", () => {
    expect(combatOverlayStyle("declared")).toMatchObject({ label: "ATTACK", width: 5 });
    expect(combatOverlayStyle("blocked")).toMatchObject({ label: "BLOCKED", dash: "10 8" });
    expect(combatOverlayStyle("resolved")).toMatchObject({ label: "IMPACT", width: 6 });
  });
});
