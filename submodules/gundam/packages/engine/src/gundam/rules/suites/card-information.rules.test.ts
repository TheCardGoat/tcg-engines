/**
 * Spec → tests: ../specs/02-card-information.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  restedResources,
  createMockPilot,
  expectCard,
  expectPlayer,
  expectFailure,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01AmuroRay010 } from "../../../../../cards/src/cards/st01/pilot/010-amuro-ray.ts";
import { st01Gm005 } from "../../../../../cards/src/cards/st01/unit/005-gm.ts";

describe("Section 2 — Card Information (specs/02-card-information.md)", () => {
  it("2-9-1 / 7-5-2-2-2: deploy fails when resource level is too low", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gundam001],
      resourceArea: activeResources(0),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(p1.deployUnit(st01Gundam001), "INSUFFICIENT_RESOURCE_LEVEL");
    expectPlayer(p1).toHaveHandCount(1);
  });

  it("2-10-1 / 7-5-2-2-3: deploy fails when level is met but active cost resources are short", () => {
    // Lv.4 needs 4+ total resources; cost 3 needs 3 active. Provide 4 total, 1 active.
    const engine = GundamTestEngine.create({
      hand: [st01Gundam001],
      resourceArea: [...activeResources(1), ...restedResources(3)],
      deck: 5,
    });
    expectFailure(engine.asPlayer(PLAYER_ONE).deployUnit(st01Gundam001), "INSUFFICIENT_RESOURCES");
  });

  it("2-9-1: level is satisfied by total resources even when some are rested", () => {
    // GM is Lv.2 cost 1 — 2 total resources (1 active) is enough for both
    const engine = GundamTestEngine.create({
      hand: [st01Gm005],
      resourceArea: [...activeResources(1), ...restedResources(1)],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gm005);
    expectPlayer(p1).toHaveZoneCount("battleArea", 1);
  });

  it("2-7-3 / 2-8-4 / 3-3-8-1: Pilot AP/HP bonuses apply to the paired Unit", () => {
    // Plain Unit without constant During Pair buffs so the pilot bonus is isolated
    const engine = GundamTestEngine.create({
      play: [st01Gm005],
      hand: [st01AmuroRay010],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectCard(p1, st01Gm005).toHaveAp(st01Gm005.ap).toHaveHp(st01Gm005.hp);

    p1.must.assignPilot(st01AmuroRay010, st01Gm005);
    // Amuro's When Paired may need a target — resolve/decline if present
    const pending = p1.getBoardView().pendingChoice;
    if (pending?.kind === "targetSelection" && pending.optionalDirectiveIndex !== undefined) {
      p1.must.resolveEffect({
        optionalAnswers: { [pending.optionalDirectiveIndex]: false },
      });
    }

    expectCard(p1, st01Gm005)
      .toHaveAp(st01Gm005.ap + st01AmuroRay010.apBonus)
      .toHaveHp(st01Gm005.hp + st01AmuroRay010.hpBonus);
  });

  it("2-4-3 / 2-5-5: pairing does not change Unit card identity (definition stays the Unit)", () => {
    const pilot = createMockPilot({
      name: "White Academy Pilot",
      color: "white",
      traits: ["academy"],
      level: 1,
      cost: 0,
      apBonus: 1,
      hpBonus: 0,
      effects: [],
    });
    const engine = GundamTestEngine.create({
      play: [st01Gm005],
      hand: [pilot],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const apBefore = p1.getVisibleCard(p1.unit(st01Gm005).instanceId)?.effectiveAp ?? st01Gm005.ap;

    p1.must.assignPilot(pilot, st01Gm005);

    const after = p1.getVisibleCard(p1.unit(st01Gm005).instanceId);
    // Runtime projection keeps the Unit definitionId; pilot is linked separately
    expect(after?.definitionId).toBe(st01Gm005.cardNumber);
    expect(after?.pilotId).toBeDefined();
    expect(after?.effectiveAp).toBe(apBefore + 1);
    // Printed Unit traits are still the Unit's (not pilot's academy)
    expect(st01Gm005.traits).not.toContain("academy");
    expect(st01Gm005.color).toBe("blue");
    expect(pilot.color).toBe("white");
  });

  it("2-12 / 3-2-6: Unit link condition is satisfied by matching Pilot name", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gundam001, st01AmuroRay010],
      resourceArea: activeResources(8),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gundam001);
    p1.must.assignPilot(st01AmuroRay010, st01Gundam001);
    // Link Unit may attack the turn it is deployed
    p1.must.attack(st01Gundam001).into("direct");
  });
});
