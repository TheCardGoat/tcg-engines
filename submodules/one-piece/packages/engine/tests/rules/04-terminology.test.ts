import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Bepo049,
  op02ImpelDownAllStars066,
  op02Magellan071,
  op02Minotaur087,
  op03SanjiSPilaf056,
  op04Sasaki048,
  op07Ain002,
  op07MonkeyDLuffy109,
  op09Bepo074,
  op09NicoRobin062,
  op13Higuma013,
  op13MeteorFist020,
  op13Otama043,
  op13WindmillVillage022,
  op14eb04Chambres017,
  op14eb04ShachiPenguin006,
  op14eb04TrafalgarLawOp14001001,
  op14eb04Vista053,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

// Turn-1 attack fixtures must make the attacker the non-first player.
const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Comprehensive Rules 4: Basic Game Terminology", () => {
  test("4-3-1 and 4-3-2: the turn player is the player whose turn is in progress", () => {
    const engine = OnePieceTestEngine.create();

    expect(engine.asSouth().view().activeSeat).toBe("south");

    engine.asSouth().endTurn();

    expect(engine.asSouth().view().activeSeat).toBe("north");
  });

  test("4-4-1-1 and 4-4-1-2: field cards are either active or rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13Higuma013, playedOnTurn: 0 }] },
      { life: 4 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op13Higuma013);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(false);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
  });

  test("4-5-1: a drawn card is added to the hand without being revealed to the opponent", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03SanjiSPilaf056],
      deck: [op13Otama043, eb01Doma005, "OP13-013", "OP13-013"],
      activeDon: 3,
    });

    engine.asSouth().play(op03SanjiSPilaf056);

    const opponentView = engine.asNorth().view().players.south;
    expect(opponentView.handCount).toBe(2);
    expect(opponentView.hand).toHaveLength(2);
    for (const card of opponentView.hand) {
      expect(card.hidden).toBe(true);
      expect(card.cardId).toBeNull();
    }
  });

  test('4-5-2 and 4-5-3: "draw 2 cards" repeats the single-draw process twice from the top of the deck', () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03SanjiSPilaf056],
      deck: [op13Otama043, eb01Doma005, "OP13-013", "OP13-013"],
      activeDon: 3,
    });

    engine.asSouth().play(op03SanjiSPilaf056);

    const otamaId = engine.asSouth().findInZone("hand", op13Otama043);
    const domaId = engine.asSouth().findInZone("hand", eb01Doma005);
    const view = engine.asSouth().view().players.south;
    // The deck top is drawn first, so the hand receives the top two cards in order.
    expect(view.hand.map((card) => card.instanceId)).toEqual([otamaId, domaId]);
    expect(view.deckCount).toBe(2);
  });

  test('4-5-3: "draw X cards" does nothing when X is 0', () => {
    // Sasaki draws cards equal to the number returned from hand; an empty hand
    // makes X = 0.
    const engine = OnePieceTestEngine.create({
      hand: [op04Sasaki048],
      deck: 4,
      activeDon: 3,
    });

    engine.asSouth().play(op04Sasaki048);

    const view = engine.asSouth().view().players.south;
    expect(view.hand).toHaveLength(0);
    expect(view.deckCount).toBe(4);
    expect(engine.asSouth().view().prompts).toHaveLength(0);
  });

  test('4-5-4 and 4-8-2: "draw up to X cards" may stop after any count from 0 to X (exception to ordinary up-to)', () => {
    const drawTwo = OnePieceTestEngine.create({
      leaderCardId: op02Magellan071,
      hand: [op02ImpelDownAllStars066, op13Higuma013, eb01Doma005],
      deck: [op07Ain002, op13MeteorFist020, "OP13-013", "OP13-013"],
      activeDon: 1,
    });

    drawTwo.playCard(op02ImpelDownAllStars066);
    drawTwo.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    drawTwo.resolveDecision("effectDrawCount", { optionId: "2" }, "south");

    const drawnView = drawTwo.getView("south").players.south;
    expect(drawnView.hand.map((card) => card.instanceId)).toEqual([
      drawTwo.findCardInZone("south", "hand", op07Ain002),
      drawTwo.findCardInZone("south", "hand", op13MeteorFist020),
    ]);
    expect(drawnView.deckCount).toBe(2);

    const drawZero = OnePieceTestEngine.create({
      leaderCardId: op02Magellan071,
      hand: [op02ImpelDownAllStars066, op13Higuma013, eb01Doma005],
      deck: [op07Ain002, op13MeteorFist020, "OP13-013", "OP13-013"],
      activeDon: 1,
    });

    drawZero.playCard(op02ImpelDownAllStars066);
    drawZero.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    drawZero.resolveDecision("effectDrawCount", { optionId: "0" }, "south");

    const zeroView = drawZero.getView("south").players.south;
    expect(zeroView.hand).toHaveLength(0);
    expect(zeroView.deckCount).toBe(4);
  });

  test("4-6-2-1: 1 damage moves the top card of the damaged player's Life to their hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13Otama043, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const otamaId = engine.asNorth().findInZone("hand", op13Otama043);
    const view = engine.asNorth().view().players.north;
    expect(view.hand.map((card) => card.instanceId)).toEqual([otamaId]);
    expect(view.lifeCount).toBe(3);
  });

  test("4-6-2-2: X damage repeats the 1-damage process X times", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, playedOnTurn: 0 }] },
      { life: [op13Otama043, eb01Doma005, "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02Minotaur087);

    // [Double Attack] deals 2 damage, so the 4-6-2-1 process runs twice.
    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const otamaId = engine.asNorth().findInZone("hand", op13Otama043);
    const domaId = engine.asNorth().findInZone("hand", eb01Doma005);
    const view = engine.asNorth().view().players.north;
    expect(view.hand.map((card) => card.instanceId)).toEqual([otamaId, domaId]);
    expect(view.lifeCount).toBe(2);
  });

  test("4-6-3: a [Trigger] card drawn from Life during damage may be activated instead of added to hand", () => {
    const activate = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op03SanjiSPilaf056, "OP13-013", "OP13-013", "OP13-013"],
        deck: [op13Otama043, eb01Doma005, "OP13-013", "OP13-013"],
      },
      SOUTH_ATTACKS,
    );
    const activateAttackerId = activate.findCardInZone("south", "character", eb01MountainGod018);
    const pilafId = activate.findCardInZone("north", "life", op03SanjiSPilaf056);

    activate.declareAttack(activateAttackerId, activate.leader("north"), "south");
    activate.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const activateView = activate.getView("north").players.north;
    // The [Trigger] resolves its [Main] effect (draw 2 cards) and the card is
    // trashed instead of joining the hand.
    expect(activateView.trash.map((card) => card.instanceId)).toContain(pilafId);
    expect(activateView.hand.map((card) => card.instanceId)).not.toContain(pilafId);
    expect(activateView.hand.map((card) => card.instanceId)).toEqual([
      activate.findCardInZone("north", "hand", op13Otama043),
      activate.findCardInZone("north", "hand", eb01Doma005),
    ]);

    const decline = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op03SanjiSPilaf056, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const declineAttackerId = decline.findCardInZone("south", "character", eb01MountainGod018);
    const declinedPilafId = decline.findCardInZone("north", "life", op03SanjiSPilaf056);

    decline.declareAttack(declineAttackerId, decline.leader("north"), "south");
    decline.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");

    // Declining adds the card to the hand like any other damaged Life card.
    expect(decline.getView("north").players.north.hand.map((card) => card.instanceId)).toEqual([
      declinedPilafId,
    ]);
  });

  test("4-6-3-1: a [Trigger] cannot be activated when the Life card is not added to hand", () => {
    // [Banish] trashes the damaged Life card instead of adding it to the hand.
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09NicoRobin062 },
      { life: [op03SanjiSPilaf056, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const pilafId = engine.asNorth().findInZone("life", op03SanjiSPilaf056);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    const view = engine.asNorth().view();
    expect(view.decisions).toHaveLength(0);
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.lifeCount).toBe(3);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(pilafId);
  });

  test("4-7-1 and 4-7-2: playing a card pays its cost; a card whose cost cannot be paid cannot be played", () => {
    const cannotPay = OnePieceTestEngine.create({ hand: [eb01MountainGod018], activeDon: 4 });
    const instanceId = cannotPay.findCardInZone("south", "hand", eb01MountainGod018);

    expect(cannotPay.expectFailure({ type: "playCard", seat: "south", instanceId }).reason).toBe(
      "Not enough active DON!! to pay the cost.",
    );

    const pays = OnePieceTestEngine.create({ hand: [eb01MountainGod018], activeDon: 5 });
    pays.playCard(eb01MountainGod018);

    const view = pays.getView("south").players.south;
    expect(view.restedDon).toBe(5);
    expect(
      view.characters.some(
        (card) =>
          card?.instanceId === pays.findCardInZone("south", "character", eb01MountainGod018),
      ),
    ).toBe(true);
  });

  test('4-8-1: "up to X" chooses between 0 and X immediately before the effect processes', () => {
    const chooseZero = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const zeroStageId = chooseZero.findCardInZone("south", "stage", op13WindmillVillage022);
    const zeroOtamaId = chooseZero.findCardInZone("south", "character", op13Otama043);

    chooseZero.activateEffect(zeroStageId, "activateMain");
    chooseZero.resolveDecision("effectOptional", { optionId: "yes" });
    const selection = chooseZero.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected a target selection.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toContain(zeroOtamaId);
    // Choosing 0 is legal and the effect resolves with no target.
    chooseZero.resolveDecision("effectTargetSelection", { selectedIds: [] });

    const zeroView = chooseZero.getView("south");
    expect(zeroView.prompts).toHaveLength(0);
    expect(
      zeroView.players.south.characters.find((card) => card?.instanceId === zeroOtamaId)?.power,
    ).toBe(0);

    const chooseOne = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const oneStageId = chooseOne.findCardInZone("south", "stage", op13WindmillVillage022);
    const oneOtamaId = chooseOne.findCardInZone("south", "character", op13Otama043);

    chooseOne.activateEffect(oneStageId, "activateMain");
    chooseOne.resolveDecision("effectOptional", { optionId: "yes" });
    chooseOne.resolveDecision("effectTargetSelection", { selectedIds: [oneOtamaId] });

    expect(
      chooseOne
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === oneOtamaId)?.power,
    ).toBe(1000);
  });

  test('4-9-2: "base" power is the printed number regardless of current power modifiers', () => {
    // Otama has 0 printed base power; 3 given DON!! raise her current power to
    // 3000, but Windmill Village's "2000 base power or less" filter still
    // matches her.
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [{ card: op13Otama043, attachedDon: 3 }],
    });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);
    const otamaId = engine.asSouth().findOnField(op13Otama043);

    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === otamaId)?.power,
    ).toBe(3000);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();
    const selection = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected a target selection.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toContain(otamaId);
  });

  // Set-base-power effects form a distinct modifier family: Vista's permanent
  // and Chambres' swap compete by absolute set value, and the highest wins.
  test("4-9-2-1: multiple set-base-power effects on one card apply the highest value", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op14eb04Chambres017], activeDon: 3 },
      {
        character: [op14eb04Vista053, op13Higuma013, eb01Doma005],
        hand: 0,
      },
    );
    const vistaId = engine.asNorth().findOnField(op14eb04Vista053);
    const higumaId = engine.asNorth().findOnField(op13Higuma013);

    // Vista's own permanent effect sets her base power to her Leader's 5000
    // during the opponent's turn; Chambres swaps her base power with the
    // 3000-power Higuma. The highest set value (5000) must win.
    engine.asSouth().play(op14eb04Chambres017);
    engine.asSouth().choose("effectTargetSelection", [vistaId, higumaId]);

    const view = engine.asNorth().view().players.north;
    expect(view.characters.find((card) => card?.instanceId === vistaId)?.power).toBe(5000);
    expect(view.characters.find((card) => card?.instanceId === higumaId)?.power).toBe(4000);
  });

  test('4-9-2-1: a "base power" filter reads the effect-set base power instead of the printed value', () => {
    // Law OP14-001: [Activate: Main] swap the base power of 2 of your
    // {Supernovas}/{Heart Pirates} Characters during this turn. All three
    // Characters are [Heart Pirates]: OP01-049 prints 4000 power, OP09-074
    // and OP14-006 print 2000. A third legal candidate keeps the selection
    // of 2 a real choice.
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04TrafalgarLawOp14001001,
      stage: op13WindmillVillage022,
      character: [op01Bepo049, op09Bepo074, op14eb04ShachiPenguin006],
    });
    const bepo4000Id = engine.asSouth().findOnField(op01Bepo049);
    const bepo2000Id = engine.asSouth().findOnField(op09Bepo074);
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);

    engine.asSouth().activateMain(engine.leader("south"));
    engine.asSouth().choose("effectTargetSelection", [bepo4000Id, bepo2000Id]);

    const characters = engine.asSouth().view().players.south.characters;
    expect(characters.find((card) => card?.instanceId === bepo4000Id)?.power).toBe(2000);
    expect(characters.find((card) => card?.instanceId === bepo2000Id)?.power).toBe(4000);

    // Windmill Village's "2000 base power or less" filter must judge the SET
    // base power in both directions: the printed-4000 Bepo now qualifies and
    // the printed-2000 Bepo no longer does.
    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();
    const selection = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected a target selection.");
    const candidateIds = selection.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(bepo4000Id);
    expect(candidateIds).not.toContain(bepo2000Id);
  });

  test('4-10-1: a failed "if" clause prevents the following clause from resolving', () => {
    // OP07-109 Monkey.D.Luffy: "If you have 2 or less Life cards, K.O. up to 1
    // of your opponent's Characters with a cost of 4 or less. Then, draw 1 card."
    const engine = OnePieceTestEngine.create(
      {
        character: [op07MonkeyDLuffy109],
        life: 3,
        deck: [op13Otama043, "OP13-013", "OP13-013"],
      },
      { character: [eb01Doma005] },
    );
    const luffyId = engine.asSouth().findOnField(op07MonkeyDLuffy109);
    const domaId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().activateMain(luffyId);
    engine.asSouth().acceptOptional();

    // With 3 Life cards the "if" clause fails: the K.O. cannot resolve even
    // though a legal target exists.
    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.some((card) => card?.instanceId === domaId),
    ).toBe(true);
    expect(engine.asSouth().view().players.north.trash).toHaveLength(0);
  });

  test('4-10-1 contrast: when the "if" clause holds, the following clause resolves', () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op07MonkeyDLuffy109],
        life: 2,
        deck: [op13Otama043, "OP13-013", "OP13-013"],
      },
      { character: [eb01Doma005] },
    );
    const luffyId = engine.asSouth().findOnField(op07MonkeyDLuffy109);
    const domaId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().activateMain(luffyId);
    engine.asSouth().acceptOptional();
    engine.asSouth().choose("effectTargetSelection", [domaId]);

    expect(
      engine
        .asNorth()
        .view()
        .players.north.trash.map((card) => card.instanceId),
    ).toContain(domaId);
  });

  test('4-10-2: a failed "then" clause does not prevent later clauses from resolving', () => {
    // With 2 Life cards but no legal K.O. target, the first clause cannot
    // resolve; the "Then, draw 1 card" clause still resolves.
    const engine = OnePieceTestEngine.create({
      character: [op07MonkeyDLuffy109],
      life: 2,
      deck: [op13Otama043, "OP13-013", "OP13-013"],
    });
    const luffyId = engine.asSouth().findOnField(op07MonkeyDLuffy109);

    engine.asSouth().activateMain(luffyId);
    engine.asSouth().acceptOptional();

    const view = engine.asSouth().view().players.south;
    expect(view.hand.map((card) => card.instanceId)).toEqual([
      engine.asSouth().findInZone("hand", op13Otama043),
    ]);
    expect(view.deckCount).toBe(2);
  });

  test("4-12-1: «Set Power to 0» reduces power by its current value at activation for the duration", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Ain002], activeDon: 7 },
      { character: [op13Higuma013] },
    );
    const higumaId = engine.asNorth().findOnField(op13Higuma013);

    engine.asSouth().play(op07Ain002);
    engine.asSouth().choose("effectTargetSelection", [higumaId]);

    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === higumaId)?.power,
    ).toBe(0);

    // The reduction lasts only for the printed duration ("during this turn").
    engine.asSouth().endTurn();

    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === higumaId)?.power,
    ).toBe(3000);
  });

  test("4-12-2: «Set Power to 0» does nothing when the target's power is already negative", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13MeteorFist020, op07Ain002], activeDon: 10 },
      { character: [op13Higuma013] },
    );
    const higumaId = engine.asNorth().findOnField(op13Higuma013);

    engine.asSouth().play(op13MeteorFist020);
    engine.asSouth().choose("effectTargetSelection", [higumaId]);
    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === higumaId)?.power,
    ).toBe(-2000);

    engine.asSouth().play(op07Ain002);
    engine.asSouth().choose("effectTargetSelection", [higumaId]);

    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === higumaId)?.power,
    ).toBe(-2000);
  });
});
