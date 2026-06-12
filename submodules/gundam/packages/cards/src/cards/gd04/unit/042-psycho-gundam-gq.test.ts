import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04DeuxMurasame091 } from "../pilot/091-deux-murasame.ts";
import { gd04PsychoGundamGq042 } from "./042-psycho-gundam-gq.ts";

describe("Psycho Gundam (GQ) (GD04-042)", () => {
  it("deals 2 damage after a Cyber-Newtype paired friendly Unit destroys an enemy shield", () => {
    const enemy = createMockUnit({ ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04DeuxMurasame091],
        play: [gd04PsychoGundamGq042],
        resourceArea: activeResources(7),
      },
      { deck: 1, play: [enemy] },
    );
    seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const psychoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04DeuxMurasame091, psychoId));
    expectSuccess(engine.resolveCombat({ attackerId: psychoId, target: "direct" }));

    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("shieldArea")).toHaveLength(0);
    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });
});
