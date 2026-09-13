import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op02Fullbody111,
  op02Hina110,
  op02Jango100,
  op02Minotaur087,
  op02MonkeyDLuffy062,
  op03Namule007,
  op03PortgasDAce001,
  op04Barrier095,
  op04IceOni047,
  op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038,
  op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
  op05Hack012,
  op13Higuma013,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

// Mid-game fixtures default to turnNumber 3 (both seats past 6-5-6-1).
// SOUTH_ATTACKS still documents "south is the attacker"; with turnNumber: 1
// pinned, make the attacker the non-first player (second player is banned on
// turn 2, not turn 1).
const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Comprehensive Rules 7: Card Attacks and Battles", () => {
  test("7-1 and 7-1-1-1: the turn player declares an attack by resting an active Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {},
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.asNorth().chooseCounter();
    expect(engine.asSouth().view().players.south.leader.rested).toBe(true);
    expect(engine.asSouth().view().players.north.lifeCount).toBe(2);
  });

  test("7-1-1-2: the attack target is the opponent's Leader or a rested Character, never an active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [eb01Doma005, { card: op03Namule007, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const activeId = engine.asNorth().findOnField(eb01Doma005);
    const restedId = engine.asNorth().findOnField(op03Namule007);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId,
        targetId: activeId,
      }).reason,
    ).toBe("The selected target cannot be attacked.");

    engine.asSouth().attack(attackerId, restedId);
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === activeId),
    ).toBe(true);
  });

  test("7-1-1-3: [When Attacking] effects activate at the Attack Step, before the battle continues", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Fullbody111, playedOnTurn: 0 },
          { card: op02Jango100, playedOnTurn: 0 },
        ],
      },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02Fullbody111);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    // The battle is paused at the Counter Step; the [When Attacking] +3000 has
    // already activated and applies while the battle is still unresolved.
    expect(engine.asNorth().pendingDecision("battleCounter")).toBeDefined();
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(6000);

    engine.asNorth().chooseCounter();
    expect(engine.asSouth().view().players.north.lifeCount).toBe(3);
  });

  // 7-1-1-4: after the [When Attacking] effect returns the attack target to
  // its owner's hand, the battle ends immediately (no Block Step, no Counter
  // Step, no damage) and the returned card stays in hand.
  test("7-1-1-4: if the target leaves the area during the Attack Step, the battle ends without damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02MonkeyDLuffy062, playedOnTurn: 0 }],
        hand: [op13Higuma013, op13Higuma013],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02MonkeyDLuffy062);
    const targetId = engine.asNorth().findOnField(eb01Doma005);

    engine.asSouth().attack(attackerId, targetId);
    engine.asSouth().acceptOptional();
    engine.asSouth().choose("effectTargetSelection", [targetId]);

    expect(engine.asNorth().view().decisions).toHaveLength(0);
    expect(engine.asSouth().view().battle).toBeNull();
    expect(engine.asNorth().findInZone("hand", eb01Doma005)).toBe(targetId);
  });

  test("7-1-2-1: the attacked player can activate a [Blocker] only once during a battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [eb01TonyTonyChopper006, eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const blockerIds = engine
      .getView("north")
      .players.north.characters.map((card) => card?.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    const choice = engine.asNorth().pendingDecision("battleBlocker");

    engine.expectFailure({
      type: "resolvePrompt",
      seat: "north",
      promptId: choice.id,
      selectedIds: blockerIds,
    });
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "north",
      promptId: choice.id,
      selectedIds: [blockerIds[0]!, blockerIds[0]!],
    });

    engine.asNorth().choose("battleBlocker", [blockerIds[0]!]);

    const view = engine.asNorth().view();
    expect(view.decisions).toHaveLength(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(blockerIds[0]);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerIds[1])?.rested,
    ).toBe(false);
  });

  test("7-1-2-2: [On Block] effects activate when the [Blocker] is activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op02Hina110] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const blockerId = engine.asNorth().findOnField(op02Hina110);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().chooseBlocker(blockerId);

    const onBlock = engine.asNorth().pendingDecision("effectTargetSelection");
    const step = onBlock.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an [On Block] target choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(attackerId);
    engine.asNorth().choose("effectTargetSelection", [attackerId]);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(blockerId);
  });

  test("7-1-3-1: effects of the player being attacked that read 'when attacked' activate before the Counter Step", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        leaderCardId: op03PortgasDAce001,
        hand: [op04Barrier095, eb01Doma005],
      },
      SOUTH_ATTACKS,
    );
    const eventId = engine.asNorth().findInZone("hand", op04Barrier095);

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    engine.asNorth().trashFromHand(eventId);

    expect(engine.asNorth().pendingDecision("battleCounter")).toBeDefined();
    expect(engine.asNorth().view().players.north.leader.power).toBe(6000);

    engine.asNorth().chooseCounter();
    expect(engine.asNorth().view().players.north.lifeCount).toBe(5);
  });

  test("7-1-3-2: the attacked player may perform Counter Step actions as many times as they wish", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      { hand: [eb01Doma005, eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);
    const counterIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().choose("battleCounter", counterIds);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(counterIds),
    );
    expect(view.players.north.lifeCount).toBe(4);
  });

  test("7-1-3-2-1: trashing a Counter Character from hand adds its Counter value to the defending card's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);
    const counterId = engine.asNorth().findInZone("hand", eb01Doma005);

    // 5000 vs 5000 would win by equality; the +1000 Counter turns the battle.
    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().choose("battleCounter", [counterId]);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(counterId);
    expect(view.players.north.lifeCount).toBe(4);
    expect(view.battle).toBeNull();
  });

  test("7-1-3-2-2: the attacked player pays the cost of a [Counter] Event in hand and trashes it to activate it", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      { hand: [op04Barrier095], activeDon: 1 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);
    const eventId = engine.asNorth().findInZone("hand", op04Barrier095);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().choose("battleCounter", [eventId]);
    engine.asNorth().choose("effectTargetSelection", [engine.leader("north")]);

    const view = engine.asNorth().view();
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.restedDon).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north.lifeCount).toBe(4);
  });

  // 7-1-3-3: after the [Counter] Event K.O.'s the attacking Character, the
  // battle ends without the Damage Step and the attacked Leader takes no
  // damage.
  test("7-1-3-3: if the attacker leaves the area during the Counter Step, the battle ends without damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038], activeDon: 5 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const eventId = engine
      .asNorth()
      .findInZone("hand", op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().choose("battleCounter", [eventId]);
    engine.asNorth().choose("effectTargetSelection", [engine.leader("south")]);
    engine.asNorth().choose("effectTargetSelection", [attackerId]);

    expect(engine.asNorth().view().players.north.lifeCount).toBe(4);
    expect(engine.asSouth().view().battle).toBeNull();
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.instanceId),
    ).toContain(attackerId);
  });

  test("7-1-4-1: the attacker wins the battle when its power is equal to the defending card's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      {},
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    expect(engine.asSouth().view().players.north.lifeCount).toBe(3);
  });

  test("7-1-4-1-1: winning against a Leader deals 1 damage and moves the top Life card to the owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13WindmillVillage022, op13Higuma013, op13Higuma013, op13Higuma013],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(3);
    expect(engine.asNorth().findInZone("hand", op13WindmillVillage022)).toBeDefined();
  });

  test("7-1-4-1-1-1: dealing damage while the opponent has 0 Life wins the game for the attacking player", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asSouth().view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
  });

  test("7-1-4-1-1-2: a Life card with [Trigger] moved by damage may be revealed and activated instead of added to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [
          op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
        ],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    const trigger = engine.asNorth().pendingDecision("lifeTrigger");
    const step = trigger.steps[0];
    if (!step || !("options" in step)) throw new Error("Expected a [Trigger] choice.");
    expect(step.options.map((option) => option.id)).toEqual(
      expect.arrayContaining(["activate", "skip"]),
    );
    engine.asNorth().declineLifeTrigger();

    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(3);
    expect(
      engine.asNorth().findInZone("hand", op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037),
    ).toBeDefined();
  });

  test("7-1-4-1-1-2: activating the revealed [Trigger] resolves it instead of adding the card to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [
          op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
          op13Higuma013,
          op13Higuma013,
          op13Higuma013,
        ],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();

    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(3);
    expect(view.players.north.handCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037.id,
    );
  });

  test("7-1-4-1-1-3: [Double Attack] deals 2 damage, repeating the Life-to-hand movement for each damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, playedOnTurn: 0 }] },
      { life: 3 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02Minotaur087);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.handCount).toBe(2);
  });

  test("7-1-4-1-2: a Character that loses the battle at equal or lower power is K.O.'d to the trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      { character: [{ card: op03Namule007, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);
    const targetId = engine.asNorth().findOnField(op03Namule007);

    engine.asSouth().attack(attackerId, targetId);

    const view = engine.asSouth().view();
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.characters.some((card) => card?.instanceId === attackerId)).toBe(
      true,
    );
  });

  test("7-1-4-2: when the attacker's power is lower, it loses the battle and nothing happens", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [{ card: op03Namule007, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01Doma005);
    const bystanderId = engine.asNorth().findOnField(op03Namule007);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asSouth().view();
    expect(view.players.north.lifeCount).toBe(4);
    expect(view.players.north.characters.some((card) => card?.instanceId === bystanderId)).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.battle).toBeNull();
  });

  test("7-1-5-1 and 7-1-5-5: the battle ends and the game returns to the Main Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05Hack012, playedOnTurn: 0 },
        ],
      },
      {},
      SOUTH_ATTACKS,
    );
    const firstAttackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const secondAttackerId = engine.asSouth().findOnField(op05Hack012);

    engine.asSouth().attack(firstAttackerId, engine.asNorth().leader());
    expect(engine.asSouth().view().battle).toBeNull();

    engine.asSouth().attack(secondAttackerId, engine.asNorth().leader());
    engine.asNorth().chooseCounter();

    const view = engine.asSouth().view();
    expect(view.activeSeat).toBe("south");
    expect(view.phase).toBe("main");
    expect(view.players.north.lifeCount).toBe(2);
  });

  test("7-1-5-2: effects that read 'at the end of this battle' activate when the battle ends", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04IceOni047, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op04IceOni047);
    const battledId = engine.asNorth().findOnField(eb01Doma005);
    const deckBefore = engine.asSouth().view().players.north.deckCount;

    engine.asSouth().attack(attackerId, battledId);

    const view = engine.asSouth().view();
    expect(view.players.north.characters.some((card) => card?.instanceId === battledId)).toBe(
      false,
    );
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(view.battle).toBeNull();
  });

  test("7-1-5-3: the turn player's effects that last 'during this battle' become invalid at the end of the battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Fullbody111, playedOnTurn: 0 },
          { card: op02Jango100, playedOnTurn: 0 },
        ],
      },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02Fullbody111);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().chooseCounter();

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(3000);
  });

  test("7-1-5-4: the non-turn player's effects that last 'during this battle' become invalid at the end of the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Hack012, playedOnTurn: 0 }] },
      { hand: [op04Barrier095], activeDon: 1 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op05Hack012);
    const eventId = engine.asNorth().findInZone("hand", op04Barrier095);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().choose("battleCounter", [eventId]);
    engine.asNorth().choose("effectTargetSelection", [engine.leader("north")]);

    expect(engine.asNorth().view().players.north.leader.power).toBe(5000);
    expect(engine.asNorth().view().players.north.lifeCount).toBe(4);
  });
});
