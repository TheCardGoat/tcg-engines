import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05OvercomingHardships108 } from "./108-overcoming-hardships.ts";

describe("Overcoming Hardships (GD05-108)", () => {
  /** @behavioral-proof complete: Action timing, friendly/rested Academy target gate, visible battle redirection, and target result are public. */
  it("redirects a battling enemy to a rested friendly Academy Unit", () => {
    const redirect = createMockUnit({ traits: ["academy"], hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05OvercomingHardships108],
        play: [{ card: redirect, exhausted: true }],
        resourceArea: activeResources(3),
      },
      { play: [createMockUnit({ ap: 3 })] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const redirectId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05OvercomingHardships108));
    expectSuccess(p1.resolveEffect({ targets: [redirectId] }));

    expect(p1.getBoardView().pendingCombat?.target).toBe(redirectId);
  });
});
