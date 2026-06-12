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
import { st03FullFrontal010 } from "./010-full-frontal.ts";

describe("Full Frontal (ST03-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st03FullFrontal010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Paired】Deploy 1 (Neo Zeon) OR (Zeon) Unit Lv.4 or lower", () => {
    it("data: target filter encodes trait-OR (Neo Zeon OR Zeon) ANDed with level<=4", () => {
      // Structural assertion — the OR primitive is the point of this PR.
      const whenPaired = st03FullFrontal010.effects?.find((e) =>
        e.activation.timing?.includes("whenPaired"),
      );
      expect(whenPaired).toBeDefined();
      const directive = whenPaired!.directives[0];
      expect(directive).toMatchObject({
        action: {
          action: "deploy",
          target: {
            owner: "friendly",
            cardType: "unit",
            zone: "hand",
            attributeFilters: [
              {
                attribute: "or",
                filters: [
                  { attribute: "trait", comparison: "includes", value: "neo zeon" },
                  { attribute: "trait", comparison: "includes", value: "zeon" },
                ],
              },
              { attribute: "level", comparison: "lte", value: 4 },
            ],
          },
        },
        optional: true,
      });
    });

    it("pairing Full Frontal onto a Zeon host does not crash evaluating the OR target filter", () => {
      // End-to-end smoke: the deploy-from-hand side is optional (player
      // choice) so we cannot deterministically assert the deploy occurs
      // without a prompt resolver. This test confirms the trigger wiring
      // accepts the OR-shaped target filter at runtime (regression guard).
      const hostUnit = createMockUnit({
        level: 5,
        cost: 1,
        traits: ["neo zeon"],
        linkCondition: "[Full Frontal]",
      });
      const zeonHandUnit = createMockUnit({ level: 3, cost: 2, traits: ["zeon"] });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st03FullFrontal010, zeonHandUnit],
          resourceArea: activeResources(6),
          deck: 5,
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(st03FullFrontal010, hostUnit));
    });
  });
});
