import { describe, expect, it } from "vite-plus/test";

import { combatOverlayPresentation, combatOverlayStyle } from "./CombatOverlay";

describe("combatOverlayStyle", () => {
  it("distinguishes declaration, blocking, and impact", () => {
    expect(combatOverlayStyle("declared")).toMatchObject({ label: "ATTACK", width: 5 });
    expect(combatOverlayStyle("blocked")).toMatchObject({ label: "BLOCKED", dash: "10 8" });
    expect(combatOverlayStyle("resolved")).toMatchObject({ label: "IMPACT", width: 6 });
  });

  it("anchors compact impact feedback to the target without changing desktop geometry", () => {
    const style = combatOverlayStyle("resolved");
    const source = { x: 236, y: 505 };
    const target = { x: 236, y: 307 };

    expect(combatOverlayPresentation(390, source, target, style)).toMatchObject({
      compact: true,
      lineWidth: 7.5,
      targetRadius: 14,
      label: { x: 236, y: 343 },
    });
    expect(combatOverlayPresentation(1280, source, target, style)).toMatchObject({
      compact: false,
      lineWidth: 6,
      targetRadius: 11,
      label: { x: 236, y: 394 },
    });
  });
});
