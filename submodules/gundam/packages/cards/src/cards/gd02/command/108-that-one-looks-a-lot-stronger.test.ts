import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  expectFailure,
  hasGrantAttackTargetOption,
  expectCardInTrash,
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
    const [unitId] = p1.getCardsInZone("battleArea");
    const cmdId = p1.getHand()[0]!;

    // chooseAttackTarget auto-targets the matching friendly unit
    expectSuccess(p1.playCommand(gd02ThatOneLooksALotStronger108));

    expect(hasGrantAttackTargetOption(engine, unitId!)).toBe(true);
    expectCardInTrash(engine, cmdId, p1.playerId);
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

    // Rule 10-1-8-1-1: "Choose 1 friendly (Clan) Unit" is a required
    // play-time choice. With no Clan unit on the battlefield, the
    // chooseAttackTarget.unit filter has no candidates and the play
    // is rejected entirely — the card stays in hand and no grant
    // is ever registered.
    expectFailure(p1.playCommand(gd02ThatOneLooksALotStronger108), "NO_LEGAL_TARGETS");
    expect(hasGrantAttackTargetOption(engine, unitId!)).toBe(false);
  });
});
