import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  expectFailure,
} from "@tcg/gundam-engine";
import { gd02ThatOneLooksALotStronger108 } from "./108-that-one-looks-a-lot-stronger.ts";

describe("That One Looks A Lot Stronger? (GD02-108)", () => {
  it("【Main】grants a friendly (Clan) Unit the option to attack an active enemy Lv.4-or-lower Unit this turn", () => {
    const clanUnit = createMockUnit({ ap: 3, hp: 3, traits: ["clan"] });
    const enemyUnit = createMockUnit({ ap: 2, hp: 3, level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ThatOneLooksALotStronger108],
        play: [clanUnit],
        resourceArea: activeResources(4),
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [unitId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");
    const cmdId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(cmdId, { targets: [unitId!] }));

    expect(p1.getLegalAttackTargets(unitId!)).toContain(enemyId);
    expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played when no (Clan) unit is in play", () => {
    const nonClanUnit = createMockUnit({ ap: 3, hp: 3, traits: ["zeon"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ThatOneLooksALotStronger108],
        play: [nonClanUnit],
        resourceArea: activeResources(4),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [unitId] = p1.getCardsInZone("battleArea");
    const cmdId = p1.getHand()[0]!;

    // Rule 10-1-8-1-1: "Choose 1 friendly (Clan) Unit" is a required
    // play-time choice. With no Clan unit on the battlefield, the
    // chooseAttackTarget.unit filter has no candidates and the play
    // is rejected entirely — the card stays in hand and no grant
    // is ever registered.
    expectFailure(p1.playCommand(gd02ThatOneLooksALotStronger108), "NO_LEGAL_TARGETS");
    expect(p1.getCardZone(cmdId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getLegalAttackTargets(unitId!)).toEqual(["direct"]);
  });
});
