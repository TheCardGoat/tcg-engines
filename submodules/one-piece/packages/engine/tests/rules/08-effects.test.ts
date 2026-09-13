import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01EdwardWeevil023,
  eb01IWantToLive050,
  eb01Laboon047,
  eb01MountainGod018,
  eb01Mr9037,
  eb02Buggy018,
  eb03NicoRobin055,
  op03Carne045,
  op03Gaimon043,
  op03Nami040,
  op04PageOne053,
  op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
  op05Mansherry088,
  op05Mr1DazBonez075,
  op06Zeff048,
  op07TempestKick096,
  op09BlackVortex097,
  op09NicoRobin062,
  op10DonquixoteDoflamingo071,
  op10Sanji005,
  op12Koushirou027,
  op12Koala081,
  op12UrsaShock096,
  op13NefeltariVivi012,
  op13Otama043,
  op13PortgasDAce002,
  op13SunnyKun026,
  op13Tom069,
  op13WindmillVillage022,
  op14eb04BoaHancockOp14041041,
  st01Jinbe005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const NORTH_ATTACKS = { firstPlayer: "south", activeSeat: "north" } as const;

describe("Comprehensive Rules 8: Activating and Resolving Effects", () => {
  test('8-1-1 and 8-1-2: an effect is a card-text command; a "may" effect may be declined with no processing', () => {
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);
    const otamaId = engine.asSouth().findOnField(op13Otama043);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().declineOptional();

    const view = engine.asSouth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.stage?.rested).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === otamaId)?.power).toBe(
      op13Otama043.power,
    );
  });

  test('8-1-2 and 8-1-3-1: a non-"may" auto effect must activate automatically, once per occurrence', () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01EdwardWeevil023, eb01EdwardWeevil023],
      activeDon: 8,
    });

    // [On Play] Draw 1 card. No "may": no decline prompt is offered, the draw happens.
    // Each play replaces the played card with a drawn one: the hand size never drops.
    engine.asSouth().play(eb01EdwardWeevil023);
    expect(engine.asSouth().view().players.south.hand).toHaveLength(2);
    engine.asSouth().play(eb01EdwardWeevil023);

    const view = engine.asSouth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.hand).toHaveLength(2);
  });

  test("8-1-3-1-2: an auto effect with an activation cost cannot activate when the cost cannot be paid", () => {
    // Nico Robin: [When Attacking] You may trash 1 card with a [Trigger] from your hand: ...
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09NicoRobin062, hand: 2 },
      {},
      SOUTH_ATTACKS,
    );

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    // No hand card with a [Trigger] exists, so no cost-payment prompt is offered.
    expect(engine.asSouth().view().prompts).toHaveLength(0);
    expect(engine.asNorth().view().players.north.lifeCount).toBe(3);
  });

  test("8-1-3-2 and 8-4-3: an [Activate: Main] field effect is declared by the turn player in Main and resolves on that card", () => {
    const engine = OnePieceTestEngine.create({ stage: op13WindmillVillage022 });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().declineOptional();

    engine.asSouth().endTurn();
    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: stageId,
      trigger: "activateMain",
    });
    expect(failure.accepted).toBe(false);
  });

  test("8-1-3-4: an applied replacement effect replaces the original processing", () => {
    // Koushirou: if your (Slash) Character with a cost of 5 or less other than this Character
    // would be K.O.'d by your opponent's effect, you may rest this Character instead.
    const engine = OnePieceTestEngine.create(
      { hand: [op12UrsaShock096], activeDon: 4 },
      { character: [op12Koushirou027, eb01Doma005] },
    );
    const domaId = engine.asNorth().findOnField(eb01Doma005);
    const koushirouId = engine.asNorth().findOnField(op12Koushirou027);

    engine.asSouth().play(op12UrsaShock096);
    engine.asSouth().choose("effectTargetSelection", [domaId]);
    engine.asNorth().acceptKoReplacement();

    const view = engine.asNorth().view();
    const koushirou = view.players.north.characters.find(
      (card) => card?.instanceId === koushirouId,
    );
    expect(koushirou?.rested).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === domaId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(domaId);
  });

  test("8-1-3-4-1: declining a replacement effect leaves the original processing in place", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12UrsaShock096], activeDon: 4 },
      { character: [op12Koushirou027, eb01Doma005] },
    );
    const domaId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().play(op12UrsaShock096);
    engine.asSouth().choose("effectTargetSelection", [domaId]);
    engine.asNorth().declineKoReplacement();

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.north.characters.some((card) => card?.instanceId === domaId)).toBe(false);
  });

  test("8-1-3-4-5: a replacement effect that cannot be carried out cannot be applied", () => {
    // Koushirou is already rested, so "rest this Character instead" is impossible:
    // no replacement choice is offered and the K.O. goes through.
    const engine = OnePieceTestEngine.create(
      { hand: [op12UrsaShock096], activeDon: 4 },
      { character: [{ card: op12Koushirou027, rested: true }, eb01Doma005] },
    );
    const domaId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().play(op12UrsaShock096);
    engine.asSouth().choose("effectTargetSelection", [domaId]);

    const view = engine.asNorth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
  });

  test("8-1-4-1 and 8-1-4-2: continuous effects last for a duration (contrast one-shot processing), then end", () => {
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);
    const otamaId = engine.asSouth().findOnField(op13Otama043);
    const powerOf = () =>
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === otamaId)?.power;

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();
    engine.asSouth().choose("effectTargetSelection", [otamaId]);
    expect(powerOf()).toBe((op13Otama043.power ?? 0) + 1000);

    engine.asSouth().endTurn();
    expect(powerOf()).toBe(op13Otama043.power);
  });

  test("8-2-1-1 and 8-2-1-2: a negated effect does not occur (invalid under conditions); its activation cost cannot be paid", () => {
    // Black Vortex [Trigger]: negate the effect of up to 1 opposing Leader or Character.
    const engine = OnePieceTestEngine.create(
      { character: [op13SunnyKun026], activeDon: 1 },
      { life: [op09BlackVortex097, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();
    engine.asNorth().choose("effectTargetSelection", [sunnyId]);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: sunnyId,
      trigger: "activateMain",
    });
    expect(failure.accepted).toBe(false);
    // The cost was never paid: the active DON!! remains untouched.
    expect(engine.asSouth().view().players.south.activeDon).toBe(1);
  });

  test("8-2-3: an effect that already resolved is not retroactively invalidated", () => {
    // Buggy's [On Play] grants the Leader [Double Attack]; negating Buggy afterwards
    // does not remove the already-granted Double Attack.
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op13PortgasDAce002, hand: [eb02Buggy018], activeDon: 4 },
      {
        leaderCardId: op13PortgasDAce002,
        life: [op09BlackVortex097, "OP13-013", "OP13-013", "OP13-013"],
      },
      SOUTH_ATTACKS,
    );
    const buggyId = engine.asSouth().findInZone("hand", eb02Buggy018);

    engine.asSouth().play(eb02Buggy018);
    engine.asSouth().choose("effectTargetSelection", [engine.leader("south")]);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();
    engine.asNorth().choose("effectTargetSelection", [buggyId]);

    // Both Double Attack damages were processed even though Buggy was negated mid-attack.
    expect(engine.asSouth().view().players.north.lifeCount).toBe(2);
    expect(engine.asSouth().view().status).toBe("active");
  });

  test("8-3-1-1: multiple actions in one activation cost are all carried out to activate", () => {
    // Mansherry [Activate: Main] (1), rest this Character, place 2 cards from your trash
    // at the bottom of your deck: add up to 1 black Character with a cost of 3-5 to your hand.
    const engine = OnePieceTestEngine.create({
      character: [op05Mansherry088],
      trash: [eb01Doma005, eb01MountainGod018],
      activeDon: 1,
    });
    const mansherryId = engine.asSouth().findOnField(op05Mansherry088);

    engine.asSouth().activateMain(mansherryId);
    engine.asSouth().acceptOptional();
    const deckBefore = engine.asSouth().view().players.south.deckCount;

    const domaId = engine.asSouth().findInZone("trash", eb01Doma005);
    const mountainGodId = engine.asSouth().findInZone("trash", eb01MountainGod018);
    engine.asSouth().pendingDecision("effectCostReturnTrashToDeck");
    engine.asSouth().choose("effectCostReturnTrashToDeck", [domaId, mountainGodId]);

    const view = engine.asSouth().view();
    expect(view.players.south.restedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mansherryId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(deckBefore + 2);
  });

  test("8-3-1-3: an effect whose activation cost cannot be paid cannot be activated", () => {
    const restedStage = OnePieceTestEngine.create({
      stage: { card: op13WindmillVillage022, rested: true },
    });
    const stageId = restedStage.findCardInZone("south", "stage", op13WindmillVillage022);
    expect(
      restedStage.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: stageId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    const noActiveDon = OnePieceTestEngine.create({ character: [op13SunnyKun026] });
    const sunnyId = noActiveDon.findCardInZone("south", "character", op13SunnyKun026);
    expect(
      noActiveDon.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("8-3-1-4: an optional activation cost may be declined, forgoing the effect", () => {
    // Tom [On Play] DON!! -1: add up to 1 Stage with a cost of 3 or less from trash to hand.
    const engine = OnePieceTestEngine.create({
      hand: [op13Tom069],
      trash: [op13WindmillVillage022],
      activeDon: 2,
    });
    const donDeckBefore = engine.asSouth().view().players.south.donDeckCount;

    engine.asSouth().play(op13Tom069);
    engine.asSouth().declineOptional();

    const view = engine.asSouth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.cardId)).toContain(
      op13WindmillVillage022.id,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
  });

  test("8-3-1-5: a ① cost rests that many active DON!! cards from the cost area", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SunnyKun026],
      activeDon: 1,
    });
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().activateMain(sunnyId);
    engine.asSouth().acceptOptional();

    const view = engine.asSouth().view();
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === sunnyId)?.power).toBe(
      (op13SunnyKun026.power ?? 0) + 2000,
    );
  });

  test("8-3-1-6: a DON!! −X cost returns that many DON!! cards to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Tom069],
      trash: [op13WindmillVillage022],
      activeDon: 2,
    });
    const donDeckBefore = engine.asSouth().view().players.south.donDeckCount;

    engine.asSouth().play(op13Tom069);
    engine.asSouth().acceptOptional();

    const view = engine.asSouth().view();
    // Playing Tom rested 2 DON!!; the DON!! −1 cost returned 1 of them to the DON!! deck.
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
  });

  test("8-1-3-3-2 and 8-3-2-3: a permanent [DON!! x1] condition is met only when that many DON!! are given at activation", () => {
    const withoutDon = OnePieceTestEngine.create(
      { character: [{ card: st01Jinbe005, playedOnTurn: 0 }] },
      {},
      SOUTH_ATTACKS,
    );
    const jinbeId = withoutDon.findCardInZone("south", "character", st01Jinbe005);
    withoutDon.declareAttack(jinbeId, withoutDon.leader("north"), "south");
    expect(withoutDon.getView("south").prompts).toHaveLength(0);

    const withDon = OnePieceTestEngine.create(
      { character: [{ card: st01Jinbe005, playedOnTurn: 0 }], activeDon: 1 },
      {},
      SOUTH_ATTACKS,
    );
    const boostedId = withDon.findCardInZone("south", "character", st01Jinbe005);
    withDon.attachDon(boostedId, 1, "south");
    withDon.declareAttack(boostedId, withDon.leader("north"), "south");
    const decision = withDon.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
  });

  test("8-3-2-4: a [Your Turn] condition is met during your turn only", () => {
    const engine = OnePieceTestEngine.create({ character: [op10Sanji005] });
    const sanjiId = engine.asSouth().findOnField(op10Sanji005);
    const powerOf = () =>
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === sanjiId)?.power;

    expect(powerOf()).toBe((op10Sanji005.power ?? 0) + 3000);
    engine.asSouth().endTurn();
    expect(powerOf()).toBe(op10Sanji005.power);
  });

  test("8-3-2-1 and 8-3-2-5: [Opponent's Turn] and every other condition must all be fulfilled", () => {
    // Carne: [Opponent's Turn] if you have 20 or less cards in your deck, +3000 power.
    const smallDeck = OnePieceTestEngine.create({
      character: [op03Carne045],
      deck: 15,
    });
    const carneId = smallDeck.findCardInZone("south", "character", op03Carne045);
    const smallPower = () =>
      smallDeck
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === carneId)?.power;
    expect(smallPower()).toBe(op03Carne045.power);
    smallDeck.endTurn("south");
    expect(smallPower()).toBe((op03Carne045.power ?? 0) + 3000);

    const largeDeck = OnePieceTestEngine.create({
      character: [op03Carne045],
      deck: 25,
    });
    const bigId = largeDeck.findCardInZone("south", "character", op03Carne045);
    largeDeck.endTurn("south");
    expect(
      largeDeck.getView("south").players.south.characters.find((card) => card?.instanceId === bigId)
        ?.power,
    ).toBe(op03Carne045.power);
  });

  test('8-3-3: effects after an unfulfilled "if" clause are not resolved', () => {
    // Tempest Kick [Main]: draw 1. Then, if you have 10 or more cards in your trash,
    // give up to 1 opposing Character -3 cost during this turn.
    const belowGate = OnePieceTestEngine.create({
      hand: [op07TempestKick096],
      trash: 9,
      activeDon: 1,
    });
    belowGate.playCard(op07TempestKick096, "south");
    expect(belowGate.getView("south").prompts).toHaveLength(0);
    expect(belowGate.getView("south").players.south.hand).toHaveLength(1);

    const atGate = OnePieceTestEngine.create(
      {
        hand: [op07TempestKick096],
        trash: 10,
        activeDon: 1,
      },
      { character: [eb01Doma005] },
    );
    atGate.playCard(op07TempestKick096, "south");
    const decision = atGate.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    atGate.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [atGate.findCardInZone("north", "character", eb01Doma005)] },
      "south",
    );
    expect(atGate.getView("south").prompts).toHaveLength(0);
  });

  test("8-4-2: activating the effect of an Event card trashes that Event card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07TempestKick096],
      activeDon: 1,
    });
    const eventId = engine.asSouth().findInZone("hand", op07TempestKick096);

    engine.asSouth().play(op07TempestKick096);

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(eventId);
    // The activated hand card is public information for the opponent (8-4-1-2).
    expect(
      engine
        .asNorth()
        .view()
        .players.south.trash.map((card) => card.instanceId),
    ).toContain(eventId);
  });

  test('8-4-4-1: a choice is made during resolution, and "up to" allows choosing 0', () => {
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);
    const otamaId = engine.asSouth().findOnField(op13Otama043);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();
    engine.asSouth().chooseNoTargets();

    const view = engine.asSouth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === otamaId)?.power).toBe(
      op13Otama043.power,
    );
  });

  test("8-4-4-2 and 8-4-4-4: deck faces are checked to choose; a player may decline a secret-area choice", () => {
    // Vivi [On Play]: look at 4 cards; reveal up to 1 eligible card to hand.
    // Even though an eligible card exists, the player may choose none.
    // 8-4-4-4: the search selection exposes face-up candidate identities.
    const engine = OnePieceTestEngine.create({
      hand: [op13NefeltariVivi012],
      deck: [
        st01Jinbe005,
        eb01Doma005,
        eb01MountainGod018,
        op13Otama043,
        "OP13-013",
        "OP13-013",
        "OP13-013",
        "OP13-013",
        "OP13-013",
        "OP13-013",
      ],
      activeDon: 1,
    });

    engine.asSouth().play(op13NefeltariVivi012);
    const search = engine.asSouth().pendingDecision("effectSearchSelection");
    const step = search.steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected a search selection.");
    expect(step.min).toBe(0);
    // 8-4-4-4: choosing from the deck exposes card faces as selectable candidates.
    expect(step.candidates.length).toBeGreaterThan(0);
    expect(step.candidates.every((candidate) => typeof candidate.ref.id === "string")).toBe(true);
    engine.asSouth().chooseNoSearch();

    const lookedIds = [st01Jinbe005, eb01Doma005, eb01MountainGod018, op13Otama043].map((card) =>
      engine.asSouth().findInZone("deck", card),
    );
    engine.asSouth().pendingDecision("effectSearchRemainderOrder");
    engine.asSouth().orderCards("effectSearchRemainderOrder", lookedIds);

    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(10);
  });

  test("8-4-5: an [On K.O.] auto effect activates when the card moves to the trash, an open area", () => {
    // Sanji: [On K.O.] Draw 1 card.
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Sanji005, rested: true }], hand: 2 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      NORTH_ATTACKS,
    );
    const sanjiId = engine.asSouth().findOnField(op10Sanji005);
    const attackerId = engine.asNorth().findOnField(eb01MountainGod018);

    engine.asNorth().attack(attackerId, sanjiId);
    // Decline the Counter window so the battle resolves.
    engine.asSouth().chooseCounter();

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.south.hand).toHaveLength(3);
  });

  test('8-5-2 and 8-5-4: "when you activate an Event" reacts to playing an Event card', () => {
    // Page One: [DON!! x1] [Once Per Turn] when you activate an Event,
    // draw 1 card, then place 1 card from your hand at the bottom of your deck.
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04PageOne053, attachedDon: 1 }],
      hand: [op07TempestKick096, "OP13-013"],
      trash: 9,
      activeDon: 1,
    });

    engine.asSouth().play(op07TempestKick096);

    // Page One's reaction is pending: draw happened, and a deck-bottom choice is offered.
    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(3);
    expect(view.prompts.length).toBeGreaterThan(0);
  });

  test("8-5-3: activating only an Event card's Life Trigger effect is not a card activation", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04PageOne053, attachedDon: 1 }],
        hand: 2,
        life: [op07TempestKick096, "OP13-013", "OP13-013", "OP13-013"],
      },
      {},
      NORTH_ATTACKS,
    );

    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    // Decline the Counter window so the battle resolves.
    engine.asSouth().chooseCounter();
    engine.asSouth().activateLifeTrigger();

    // Page One did not react: no draw, no deck-bottom prompt.
    const view = engine.asSouth().view();
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.hand).toHaveLength(2);
  });

  // One K.O. fulfills both players' [When a Character is K.O.'d] triggers at
  // the same time; enqueueKoEffectsForTrigger orders the coincident group so
  // the turn player's effects resolve first.
  test("8-6-1: when activation timings coincide, the turn player resolves their effect first", () => {
    // Both Laboons read: [Once Per Turn] when a Character is K.O.'d, draw 1 and trash 1.
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Laboon047, { card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: 2,
      },
      { character: [{ card: eb01Laboon047, rested: true }], hand: 2 },
      SOUTH_ATTACKS,
    );
    const northLaboonId = engine.asNorth().findOnField(eb01Laboon047);
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, northLaboonId);
    // Decline the Counter window so the battle resolves and both Laboons trigger.
    engine.asNorth().chooseCounter();

    // Resolution order is an engine invariant: the turn player's prompt must lead the queue.
    const pendingPrompts = engine
      .getState()
      .promptQueue.filter((prompt) => prompt.status === "pending");
    expect(pendingPrompts.length).toBeGreaterThan(0);
    expect(pendingPrompts[0]!.seat).toBe("south");

    const southHandTopId = engine.asSouth().view().players.south.hand[0]!.instanceId;
    if (!southHandTopId) throw new Error("Expected a hand card to trash.");
    engine.asSouth().trashFromHand(southHandTopId);
    const northView = engine.asNorth().view();
    expect(northView.prompts.length).toBeGreaterThan(0);
  });

  // The same coincidence arises when the non-turn player plays a Character
  // through an effect: the turn player's "when your opponent plays a
  // Character" reaction must resolve before the playing player's "when you
  // play a Character" reaction.
  test("8-6-1: an effect playing a Character on the opponent's turn resolves the turn player's reaction first", () => {
    // Koala OP12-081: [Once Per Turn] when your opponent plays a Character
    // using a Character's effect, your opponent adds 1 Life card to their hand.
    // Boa Hancock OP14-041: [Opponent's Turn] when you play a Character, draw 1.
    // Mr.1 OP05-075: [On Your Opponent's Attack] DON!! -1: play up to 1
    // [Baroque Works] Character with a cost of 3 or less from your hand.
    // NORTH_ATTACKS places north past 6-5-6-1 without advancing turns (which
    // would draw into south's hand and spoil the hand-size assertions).
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04BoaHancockOp14041041,
        character: [{ card: op05Mr1DazBonez075, attachedDon: 1 }],
        hand: [eb01Mr9037],
      },
      { leaderCardId: op12Koala081 },
      NORTH_ATTACKS,
    );
    const mr9Id = engine.asSouth().findInZone("hand", eb01Mr9037);

    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().acceptOptional();
    engine.asSouth().choosePlay(mr9Id);

    // Both reactions coincide, but the turn player's Koala leads the queue
    // and Hancock's draw has not resolved yet.
    const pendingPrompts = engine
      .getState()
      .promptQueue.filter((prompt) => prompt.status === "pending");
    expect(pendingPrompts.length).toBeGreaterThan(0);
    expect(pendingPrompts[0]!.seat).toBe("north");
    expect(engine.asSouth().view().players.south.hand).toHaveLength(0);

    // Hancock's draw resolves only after the turn player's reaction.
    engine.asNorth().declineOptional();
    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);
  });

  // A Counter Event is activated by the non-turn player, so their "when you
  // activate an Event" reaction must queue behind the turn player's "when
  // your opponent activates an Event" reaction.
  test("8-6-1: a Counter Event activation resolves the turn player's reaction first", () => {
    // Zeff OP06-048: [Your Turn] when your opponent activates [Blocker] or an
    // Event, if your Leader has the [East Blue] type, you may trash 4 cards
    // from the top of your deck. Nami OP03-040 is an [East Blue] Leader.
    // Page One OP04-053: [DON!! x1] [Once Per Turn] when you activate an
    // Event, draw 1 card, then place 1 card from your hand at the bottom of
    // your deck.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04PageOne053, attachedDon: 1 }],
        hand: [eb01IWantToLive050, "OP13-013"],
        activeDon: 3,
      },
      { leaderCardId: op03Nami040, character: [op06Zeff048] },
      NORTH_ATTACKS,
    );
    const counterEventId = engine.asSouth().findInZone("hand", eb01IWantToLive050);

    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    // "...I Want to Live!!" is activated as a Counter Event; its 30-card
    // trash condition fails, so only the activation reactions fire.
    engine.asSouth().choose("battleCounter", [counterEventId]);

    // The turn player's Zeff reaction leads the queue and Page One's draw
    // has not resolved yet.
    const pendingPrompts = engine
      .getState()
      .promptQueue.filter((prompt) => prompt.status === "pending");
    expect(pendingPrompts.length).toBeGreaterThan(0);
    expect(pendingPrompts[0]!.seat).toBe("north");
    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);

    // Page One resolves after: draw 1, then the deck-bottom choice appears.
    engine.asNorth().declineOptional();
    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.prompts.length).toBeGreaterThan(0);
  });

  // An [On K.O.] effect can deal damage while its controller is not the turn
  // player; the damaged turn player's "when you take damage" reaction must
  // resolve before the dealing player's "when you deal damage" reaction.
  test("8-6-1: effect damage dealt by the non-turn player resolves the turn player's reaction first", () => {
    // Nico Robin EB03-055: [Opponent's Turn] [On K.O.] you may deal 1 damage
    // to your opponent. Ace OP13-002: [DON!! x1] [Once Per Turn] when you
    // take damage, draw 1 card. Gaimon OP03-043: when you deal damage to
    // your opponent's Life, you may trash 3 cards from the top of your deck.
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb03NicoRobin055, rested: true }, op03Gaimon043], hand: 0 },
      {
        leaderCardId: op13PortgasDAce002,
        character: [{ card: op10DonquixoteDoflamingo071, playedOnTurn: 0 }],
        hand: 0,
        activeDon: 1,
      },
      NORTH_ATTACKS,
    );
    const doflamingoId = engine.asNorth().findOnField(op10DonquixoteDoflamingo071);
    const robinId = engine.asSouth().findOnField(eb03NicoRobin055);

    engine.asNorth().attachDon(engine.leader("north"), 1);
    engine.asNorth().attack(doflamingoId, robinId);
    // South has no Counter in hand, so the 9000-power attack K.O.'d Robin;
    // accept her [On K.O.] effect damage.
    engine.asSouth().acceptOptional();

    // The turn player's Ace draw resolves before south's Gaimon prompt: the
    // lost Life card and the drawn card are already in north's hand. Before
    // the fix, the draw still queued behind Gaimon's prompt.
    const pendingPrompts = engine
      .getState()
      .promptQueue.filter((prompt) => prompt.status === "pending");
    expect(pendingPrompts.length).toBeGreaterThan(0);
    expect(pendingPrompts[0]!.seat).toBe("south");
    expect(engine.asNorth().view().players.north.hand).toHaveLength(2);

    engine.asSouth().declineOptional();
  });

  test("8-6-2: an effect whose timing is fulfilled during damage processing waits until it completes", () => {
    // Ace Leader: [DON!! x1] [Once Per Turn] when you take damage, draw 1 card.
    // Double Attack deals 2 damage; Ace's reaction must wait for both damages.
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op13PortgasDAce002, hand: [eb02Buggy018], activeDon: 4 },
      {
        leaderCardId: op13PortgasDAce002,
        life: [
          op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
          "OP13-013",
          "OP13-013",
          "OP13-013",
        ],
        activeDon: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );

    // North gives 1 DON!! to their Leader on their own turn, then passes.
    engine.asNorth().attachDon(engine.leader("north"), 1);
    engine.asNorth().endTurn();

    engine.asSouth().play(eb02Buggy018);
    engine.asSouth().choose("effectTargetSelection", [engine.leader("south")]);
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    // Mid-processing: the first Life's [Trigger] decision is pending, and Ace has not drawn yet.
    engine.asNorth().pendingDecision("lifeTrigger");
    expect(engine.asNorth().view().players.north.hand).toHaveLength(0);

    engine.asNorth().declineLifeTrigger();
    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(2);
    // Skipped Trigger card + second damage's Life card + Ace's draw after all damage.
    expect(view.players.north.hand).toHaveLength(3);
  });

  test("8-6-2-1: a [Trigger] checked during damage processing may suspend that processing", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        life: [
          op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
          "OP13-013",
          "OP13-013",
          "OP13-013",
        ],
      },
      SOUTH_ATTACKS,
    );
    const triggerId = engine
      .asNorth()
      .findInZone("life", op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    // Damage processing is suspended on the Trigger decision.
    const decision = engine.asNorth().pendingDecision("lifeTrigger");
    expect(decision.actorId).toBe("north");
    expect(engine.asNorth().view().players.north.lifeCount).toBe(3);

    engine.asNorth().declineLifeTrigger();
    expect(
      engine
        .asNorth()
        .view()
        .players.north.hand.map((card) => card.instanceId),
    ).toContain(triggerId);
  });

  test("8-6-3: a reaction to a card activation resolves after that activation completes", () => {
    // Tempest Kick [Main] (draw 1, then -3 cost with 10+ trash) must fully resolve
    // before Page One's "when you activate an Event" reaction begins.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04PageOne053, attachedDon: 1 }],
        hand: [op07TempestKick096, "OP13-013"],
        trash: 10,
        activeDon: 1,
      },
      { character: [eb01Doma005] },
    );

    engine.asSouth().play(op07TempestKick096);

    // The first pending choice belongs to Tempest Kick itself, and Page One has not drawn.
    const pendingPrompts = engine
      .getState()
      .promptQueue.filter((prompt) => prompt.status === "pending");
    expect(pendingPrompts[0]?.resolutionContext?.intent).toBe("effectTargetSelection");
    expect(engine.asSouth().view().players.south.hand).toHaveLength(2);

    engine.asSouth().choose("effectTargetSelection", [engine.asNorth().findOnField(eb01Doma005)]);

    // Only after the Event completed did Page One's reaction begin.
    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(3);
    expect(view.prompts.length).toBeGreaterThan(0);
  });
});
