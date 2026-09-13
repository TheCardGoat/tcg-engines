import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { vexingQuillhand } from "../../../../../../cards/src/cards/equipment/vexing-quillhand.ts";

describe("vexing-quillhand (EVR103)", () => {
  it("AAA: Action destroy-self creates two Runechants and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [vexingQuillhand],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vexingQuillhand);
    game.passBoth();

    expect(Bravo.zone("arms")).not.toContain(vexingQuillhand.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(vexingQuillhand.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id.toLowerCase().includes("runechant"))).toHaveLength(
      2,
    );
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: zero action points cannot activate the Action", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [vexingQuillhand], actionPoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(vexingQuillhand)).toThrow();
    expect(Bravo.zone("arms")).toContain(vexingQuillhand.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id.toLowerCase().includes("runechant"))).toHaveLength(
      0,
    );
  });
});
