import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05NewtypeLabsDirector115 } from "./115-newtype-labs-director.ts";

describe("Newtype Labs Director (GD05-115)", () => {
  it("adds the chosen Neo Zeon Pilot from trash to hand", () => {
    const eligible = createMockPilot({ traits: ["neo zeon"] });
    const ineligible = createMockPilot({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd05NewtypeLabsDirector115],
      trash: [eligible, ineligible],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, ineligibleId] = p1.getCardsInZone("trash");

    expectSuccess(p1.playCommand(gd05NewtypeLabsDirector115));
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(ineligibleId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("draws one card when its Burst is accepted from a destroyed Shield", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd05NewtypeLabsDirector115], deck: 1 },
      { play: [attacker], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const burst = p1.getBoardView().pendingChoice;
    if (burst?.kind !== "optional")
      throw new Error("Expected Newtype Labs Director's Burst choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(0);
  });
});
