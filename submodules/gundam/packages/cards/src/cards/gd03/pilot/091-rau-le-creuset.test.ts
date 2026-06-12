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
import { gd03JachinDue127 } from "../base/127-jachin-due.ts";
import { gd03RauLeCreuset091 } from "./091-rau-le-creuset.ts";

describe("Rau Le Creuset (GD03-091)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03RauLeCreuset091] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("behavior: when linked, add one ZAFT Base card from your trash to your hand", () => {
    const linkHost = createMockUnit({
      linkCondition: "[Rau Le Creuset]",
      // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
    } as any);
    const engine = GundamTestEngine.create({
      hand: [gd03RauLeCreuset091],
      play: [linkHost],
      trash: [gd03JachinDue127],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(gd03RauLeCreuset091, hostId));

    expect(p1.getCardsInZone("hand")).toContain(baseId);
    expect(p1.getCardsInZone("trash")).not.toContain(baseId);
  });
});
