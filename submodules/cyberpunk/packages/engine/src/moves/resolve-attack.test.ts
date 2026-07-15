import { describe, expect, it } from "vite-plus/test";
import { createMockUnit } from "../testing/card-mocks.ts";
import { CyberpunkTestEngine, P1, P2 } from "../testing/test-engine.ts";
import { getProjectedDirectAttackGigStealCount } from "./resolve-attack.ts";

describe("direct attack Gig steal projection", () => {
  it("projects 1 Gig for a 5-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-5", power: 5 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(1);
  });

  it("projects 2 Gigs for a 10-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-10", power: 10 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(2);
  });

  it("projects 0 Gigs for a 0-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-0", power: 0 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(0);
  });

  it("caps projected steals by rival Gigs", () => {
    const attacker = createMockUnit({ id: "project-steal-capped", power: 30 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(2);
  });

  it("does not project a steal after a blocker redirects the direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-blocked", power: 10 });
    const blocker = createMockUnit({
      id: "project-steal-blocker",
      keywords: ["blocker"],
      power: 2,
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [{ card: blocker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.useBlocker(blocker, { as: P2 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBeNull();
  });
});
