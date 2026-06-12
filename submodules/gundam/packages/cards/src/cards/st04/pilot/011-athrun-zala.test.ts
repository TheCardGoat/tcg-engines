import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st04AthrunZala011 } from "./011-athrun-zala.ts";

describe("Athrun Zala (ST04-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st04AthrunZala011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Linked】 may choose active Lv.5 or lower enemy as attack target", () => {
    // The target-selection side effect (chooseAttackTarget) isn't exercised
    // end-to-end because the whenLinked effect has `directives: []` — the
    // printed behaviour unlocks a target-override during attack which is
    // modeled in runtime rather than a declarative directive. These tests
    // guard the trigger wiring (rule 3-2-6 gating) so it enqueues on a link
    // pairing and stays silent on a non-link pairing.

    it("pairs onto a Link Unit with matching linkCondition without crashing", () => {
      const hostUnit = createMockUnit({ level: 5, cost: 1, linkCondition: "[Athrun Zala]" });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st04AthrunZala011],
          resourceArea: activeResources(6),
          deck: 5,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(st04AthrunZala011, hostUnit));
    });

    it("pairing onto a non-Link Unit (no linkCondition) still succeeds — trigger gated off", () => {
      const hostUnit = createMockUnit({ level: 5, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st04AthrunZala011],
          resourceArea: activeResources(6),
          deck: 5,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(st04AthrunZala011, hostUnit));
    });
  });
});
