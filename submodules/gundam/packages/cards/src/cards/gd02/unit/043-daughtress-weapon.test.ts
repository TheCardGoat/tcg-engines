import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02DaughtressWeapon043 } from "./043-daughtress-weapon.ts";

describe("Daughtress Weapon (GD02-043)", () => {
  it("deploys a [Daughtress] token when another friendly (New UNE) Unit is in play", () => {
    const newUneAlly = createMockUnit({ traits: ["new une"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02DaughtressWeapon043],
        play: [newUneAlly],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    const playBefore = p1.getCardsInZone("battleArea").length;
    expectSuccess(p1.deployUnit(gd02DaughtressWeapon043));
    const playAfter = p1.getCardsInZone("battleArea").length;

    // +1 for Daughtress Weapon itself, +1 for the token = +2.
    expect(playAfter).toBe(playBefore + 2);
  });

  it("does NOT deploy a token without another friendly (New UNE) Unit", () => {
    const unrelated = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02DaughtressWeapon043],
        play: [unrelated],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    const playBefore = p1.getCardsInZone("battleArea").length;
    expectSuccess(p1.deployUnit(gd02DaughtressWeapon043));
    const playAfter = p1.getCardsInZone("battleArea").length;

    // Only Daughtress Weapon itself enters play.
    expect(playAfter).toBe(playBefore + 1);
  });
});
