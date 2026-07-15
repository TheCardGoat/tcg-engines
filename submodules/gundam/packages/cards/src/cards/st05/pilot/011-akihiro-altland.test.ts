import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st05AkihiroAltland011 } from "./011-akihiro-altland.ts";

describe("Akihiro Altland (ST05-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st05AkihiroAltland011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【During Link】adds a Tekkadan Lv.2 or lower Unit from trash after destroying an enemy Unit with battle damage", () => {
    const pairedUnit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 1,
      cost: 1,
      // biome-ignore lint/suspicious/noExplicitAny: UnitCard linkCondition is optional on the type
      linkCondition: "[Akihiro Altland]",
    } as any);
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const target = createMockUnit({ name: "Tekkadan Target", traits: ["tekkadan"], level: 2 });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["gjallarhorn"], level: 2 });
    const tooHighLevel = createMockUnit({ name: "Too High", traits: ["tekkadan"], level: 3 });

    const engine = GundamTestEngine.create(
      {
        hand: [st05AkihiroAltland011],
        play: [pairedUnit],
        resourceArea: activeResources(5),
        trash: [wrongTrait, tooHighLevel, target],
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;
    const [wrongTraitId, tooHighLevelId, targetId] = p1.getCardsInZone("trash");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilotId, attackerId));

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: pilotId,
      legalTargetIds: [targetId],
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(targetId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(wrongTraitId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(tooHighLevelId!)).toBe(`trash:${PLAYER_ONE}`);
  });
});
