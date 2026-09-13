import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04Baby5032,
  op04Koza006,
  op11MonkeyDLuffy040,
  op13MeteorFist020,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

// Executable specification for Comprehensive Rules Version 1.2.0, chapter 6
// "Game Progression" (comprehensive-rules.md lines 504-580). Quiet vanilla
// fixtures are used unless a rule needs a specific printed timing.
const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Comprehensive Rules 6: Game Progression", () => {
  // Also covers 6-5-2-1 (declaring the end of the Main Phase proceeds to the
  // End Phase) and 6-1-2 (the turn player performs the phases in order).
  test("6-1-1 and 6-1-2: the turn player progresses a Refresh, Draw, DON!!, Main, and End Phase sequence", () => {
    const engine = OnePieceTestEngine.create();

    const result = engine.asSouth().endTurn();

    const messages = result.logs.map((entry) => entry.message);
    const sequence = [
      "South ends the turn.",
      "North enters Refresh.",
      "North enters Draw.",
      "North enters DON!! phase.",
      "North enters Main.",
    ];
    const indexes = sequence.map((message) => messages.indexOf(message));
    for (const [index, position] of indexes.entries()) {
      expect(position, `missing log: ${sequence[index]}`).toBeGreaterThanOrEqual(0);
    }
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
  });

  test("6-2-1: effects that last 'until the start of your next turn' end during the Refresh Phase", () => {
    // Koza's [When Attacking] gives itself +2000 "until the start of your next turn".
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Koza006, playedOnTurn: 0 }] },
      {},
      SOUTH_ATTACKS,
    );
    const kozaId = engine.asSouth().findOnField(op04Koza006);
    const kozaPower = () =>
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === kozaId)?.power;

    engine.asSouth().attack(kozaId, engine.asNorth().leader());
    engine.asSouth().acceptOptional();
    expect(kozaPower()).toBe(3000 + 2000);

    engine.asSouth().endTurn();
    expect(kozaPower()).toBe(5000); // persists through the opponent's turn

    engine.asNorth().endTurn();
    expect(kozaPower()).toBe(3000); // ends at the start of the controller's next turn
  });

  test("6-2-2: 'at the start of your turn' effects activate during the Refresh Phase, before the draw", () => {
    // OP11-040 Monkey.D.Luffy has an optional effect that activates at the
    // start of the turn when its controller has 8+ DON!! on their field.
    const engine = OnePieceTestEngine.create(
      {},
      { leaderCardId: op11MonkeyDLuffy040, activeDon: 8 },
    );

    engine.asSouth().endTurn();

    // The Refresh-phase effect pauses the phase sequence before the Draw and
    // DON!! phases have run.
    const activation = engine.asNorth().pendingDecision("effectOptional");
    expect(activation.id).toBeTruthy();
    expect(engine.asNorth().view().players.north.handCount).toBe(0);
    expect(engine.asNorth().view().players.north.activeDon).toBe(8);

    engine.asNorth().declineOptional();
    expect(engine.asNorth().view().players.north.handCount).toBe(1);
    expect(engine.asNorth().view().players.north.activeDon).toBe(10);
  });

  test("6-2-3: DON!! cards given to Leader and Character cards return to the cost area during the Refresh Phase", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      activeDon: 2,
      restedDon: 1,
    });
    const targetId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attachDon(targetId, 1);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === targetId)?.attachedDon,
    ).toBe(1);

    engine.asSouth().endTurn();
    engine.asNorth().endTurn();

    // 6-2-3 rests the returned DON!! and 6-2-4 then readies every rested card,
    // so the returned DON!! is active in the cost area by the Main Phase.
    const south = engine.asSouth().view().players.south;
    expect(south.characters.find((card) => card?.instanceId === targetId)?.attachedDon).toBe(0);
    expect(south.restedDon).toBe(0);
    // 1 remaining active + 1 previously rested + 1 returned + 2 from the DON!! phase.
    expect(south.activeDon).toBe(5);
  });

  test("6-2-4: rested Leader, Character, Stage, and cost area cards become active during the Refresh Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, rested: true, playedOnTurn: 0 }],
        stage: { card: op13WindmillVillage022, rested: true },
        restedDon: 2,
      },
      {},
      SOUTH_ATTACKS,
    );

    // Rest the Leader through a public attack command.
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    expect(engine.asSouth().view().players.south.leader.rested).toBe(true);

    engine.asSouth().endTurn();
    engine.asNorth().endTurn();

    const south = engine.asSouth().view().players.south;
    expect(south.leader.rested).toBe(false);
    expect(south.characters[0]?.rested).toBe(false);
    expect(south.stage?.rested).toBe(false);
    expect(south.restedDon).toBe(0);
    // 2 previously rested DON!! readied + 2 from the DON!! phase.
    expect(south.activeDon).toBe(4);
  });

  test("6-3-1: the turn player draws 1 card from their deck during the Draw Phase", () => {
    const engine = OnePieceTestEngine.create();

    engine.asSouth().endTurn();

    const north = engine.asNorth().view().players.north;
    expect(north.handCount).toBe(1);
    expect(north.deckCount).toBe(9);
  });

  test("6-3-1: the player going first does not draw a card on their first turn", () => {
    const engine = OnePieceTestEngine.create({}, {}, { skipSetup: false });
    engine.startGame();

    // First player's first turn: no draw.
    expect(engine.asSouth().view().players.south.handCount).toBe(0);

    // The second player draws on their first turn.
    engine.asSouth().endTurn();
    expect(engine.asNorth().view().players.north.handCount).toBe(1);

    // The first player draws from their second turn onward.
    engine.asNorth().endTurn();
    expect(engine.asSouth().view().players.south.handCount).toBe(1);
  });

  test("6-4-1: the DON!! phase places 2 DON!! cards from the DON!! deck face-up in the cost area", () => {
    const engine = OnePieceTestEngine.create();

    engine.asSouth().endTurn();

    const north = engine.asNorth().view().players.north;
    expect(north.activeDon).toBe(2);
    expect(north.donDeckCount).toBe(8);
  });

  test("6-4-1: the player going first places only 1 DON!! card on their first turn", () => {
    const engine = OnePieceTestEngine.create({}, {}, { skipSetup: false });
    engine.startGame();

    const south = engine.asSouth().view().players.south;
    expect(south.activeDon).toBe(1);
    expect(south.donDeckCount).toBe(9);
  });

  test("6-4-2: a DON!! deck with only 1 card places only 1 DON!! card", () => {
    const engine = OnePieceTestEngine.create({}, { donDeckCount: 1 });

    engine.asSouth().endTurn();

    const north = engine.asNorth().view().players.north;
    expect(north.activeDon).toBe(1);
    expect(north.donDeckCount).toBe(0);
  });

  test("6-4-3: an empty DON!! deck places no DON!! cards", () => {
    const engine = OnePieceTestEngine.create({}, { donDeckCount: 0 });

    engine.asSouth().endTurn();

    const north = engine.asNorth().view().players.north;
    expect(north.activeDon).toBe(0);
    expect(north.donDeckCount).toBe(0);
    expect(engine.asNorth().view().status).toBe("active");
  });

  test("6-5-2: Main Phase actions may be performed in any order and as many times as you wish", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01MountainGod018], activeDon: 7 },
      {},
      SOUTH_ATTACKS,
    );

    // Interleave Give DON!!, Play a Card, Give DON!!, and Battle in one Main Phase.
    engine.asSouth().attachDon(engine.leader("south"), 1);
    engine.asSouth().play(eb01MountainGod018);
    engine.asSouth().attachDon(engine.leader("south"), 1);
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    const south = engine.asSouth().view().players.south;
    expect(south.characters.some((card) => card?.cardId === eb01MountainGod018.id)).toBe(true);
    expect(south.leader.attachedDon).toBe(2);
    expect(south.restedDon).toBe(5);
    expect(south.leader.rested).toBe(true);
  });

  test("6-5-3-1: play a Character card from your hand by resting DON!! equal to its cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: eb01MountainGod018.cost,
    });

    engine.asSouth().play(eb01MountainGod018);

    const playedId = engine.asSouth().findOnField(eb01MountainGod018);
    const south = engine.asSouth().view().players.south;
    expect(south.characters.some((card) => card?.instanceId === playedId)).toBe(true);
    expect(south.hand).toHaveLength(0);
    expect(south.restedDon).toBe(eb01MountainGod018.cost);
    expect(south.activeDon).toBe(0);
  });

  test("6-5-3-1: play a Stage card from your hand by resting DON!! equal to its cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13WindmillVillage022],
      activeDon: op13WindmillVillage022.cost,
    });

    engine.asSouth().play(op13WindmillVillage022);

    const south = engine.asSouth().view().players.south;
    expect(south.stage?.cardId).toBe(op13WindmillVillage022.id);
    expect(south.restedDon).toBe(op13WindmillVillage022.cost);
    expect(south.activeDon).toBe(0);
  });

  test("6-5-3-1: activate a [Main] Event card from your hand by resting DON!! equal to its cost", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13MeteorFist020], activeDon: op13MeteorFist020.cost },
      { character: [eb01MountainGod018] },
    );

    engine.asSouth().play(op13MeteorFist020);
    // "Up to 1" target: choosing zero targets still resolves the [Main] activation.
    engine.asSouth().chooseNoTargets();

    const south = engine.asSouth().view().players.south;
    expect(south.hand).toHaveLength(0);
    expect(south.trash.map((card) => card.cardId)).toContain(op13MeteorFist020.id);
    expect(south.restedDon).toBe(op13MeteorFist020.cost);
    expect(south.activeDon).toBe(0);
  });

  test("6-5-3-1: a card cannot be played without enough active DON!! to pay its cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: eb01MountainGod018.cost - 1,
    });

    const failure = engine.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: engine.asSouth().findInZone("hand", eb01MountainGod018),
    });
    expect(failure.reason).toBe("Not enough active DON!! to pay the cost.");
  });

  // The negative case also covers 6-1-2: only the turn player performs Main
  // Phase actions.
  test("6-5-4-1: the turn player can activate [Activate: Main] effects during their Main Phase", () => {
    const engine = OnePieceTestEngine.create(
      { stage: op13WindmillVillage022 },
      { stage: op13WindmillVillage022 },
    );
    const stageId = engine.asSouth().findInZone("stage", op13WindmillVillage022);

    engine.asSouth().activateMain(stageId);
    engine.asSouth().acceptOptional();

    const south = engine.asSouth().view().players.south;
    expect(south.stage?.rested).toBe(true); // "rest this Stage" cost was paid
    expect(engine.asSouth().view().prompts).toHaveLength(0);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "north",
      sourceInstanceId: engine.asNorth().findInZone("stage", op13WindmillVillage022),
      trigger: "activateMain",
    });
    expect(failure.reason).toBeTruthy();
  });

  test("6-5-5-1: giving places an active DON!! card from the cost area underneath your Leader or a Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      stage: op13WindmillVillage022,
      activeDon: 4,
    });
    const characterId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attachDon(engine.leader("south"), 1);
    engine.asSouth().attachDon(characterId, 2);

    const south = engine.asSouth().view().players.south;
    expect(south.leader.attachedDon).toBe(1);
    expect(south.characters.find((card) => card?.instanceId === characterId)?.attachedDon).toBe(2);
    expect(south.activeDon).toBe(1);

    // A Stage is not a legal giving target.
    const failure = engine.expectFailure({
      type: "attachDon",
      seat: "south",
      targetId: engine.asSouth().findInZone("stage", op13WindmillVillage022),
      amount: 1,
    });
    expect(failure.reason).toBe("DON!! can only be attached to your leader or characters.");
  });

  test("6-5-5-2: Leader and Character cards gain +1000 power per given DON!! during your turn only", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      activeDon: 2,
    });
    const characterId = engine.asSouth().findOnField(eb01MountainGod018);
    const projected = () =>
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId);

    engine.asSouth().attachDon(characterId, 2);
    expect(projected()?.power).toBe(7000 + 2000);

    engine.asSouth().endTurn();

    // Across the turn handoff the DON!! stays attached, but its +1000 power
    // contribution is inactive until the controller's next turn.
    expect(projected()?.attachedDon).toBe(2);
    expect(projected()?.power).toBe(7000);
  });

  test("6-5-5-3: giving can be performed as many times as you wish to the extent possible", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      activeDon: 3,
    });
    const characterId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attachDon(characterId, 1);
    engine.asSouth().attachDon(characterId, 1);
    engine.asSouth().attachDon(engine.leader("south"), 1);

    const south = engine.asSouth().view().players.south;
    expect(south.characters.find((card) => card?.instanceId === characterId)?.attachedDon).toBe(2);
    expect(south.leader.attachedDon).toBe(1);
    expect(south.activeDon).toBe(0);

    // "To the extent possible": with no active DON!! left, giving is rejected.
    const failure = engine.expectFailure({
      type: "attachDon",
      seat: "south",
      targetId: characterId,
      amount: 1,
    });
    expect(failure.reason).toBe("Not enough active DON!! to attach.");
  });

  test("6-5-5-4: when a card with given DON!! moves to another area, those DON!! go to the cost area rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, rested: true, attachedDon: 2 }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const targetId = engine.asNorth().findOnField(eb01MountainGod018);

    // 7000 vs 7000: the attack wins on equality and the target is K.O.'d.
    engine.asSouth().attack(attackerId, targetId);

    const north = engine.asNorth().view().players.north;
    expect(north.characters.every((card) => card === null)).toBe(true);
    expect(north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(north.restedDon).toBe(2);
    expect(north.activeDon).toBe(0);
  });

  // 6-5-2 lists "6-5-5. Give DON!! Cards" among Main Phase actions, so giving
  // is illegal while a battle (a separate Main Phase action per 6-5-6) is in
  // progress, even though the phase remains "main".
  test("6-5-5: giving DON!! cannot be performed while a battle is in progress", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 2 },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    // The battle is held at the Counter Step by north's [Counter] hand card.
    engine.asNorth().pendingDecision("battleCounter");

    const failure = engine.expectFailure({
      type: "attachDon",
      seat: "south",
      targetId: attackerId,
      amount: 1,
    });
    expect(failure.reason).toBe("DON!! can only be attached during your main phase.");

    // Once the battle completes, giving is legal again.
    engine.asNorth().chooseCounter();
    engine.asSouth().attachDon(attackerId, 1);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.attachedDon,
    ).toBe(1);
  });

  test("6-5-6-1: neither player can battle on their first turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { turnNumber: 1 },
    );
    const southId = engine.asSouth().findOnField(eb01MountainGod018);
    const northId = engine.asNorth().findOnField(eb01MountainGod018);

    // First player's first turn (game turn 1): Leader and Character attacks fail.
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: engine.leader("south"),
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: southId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    // Second player's first turn (game turn 2): same prohibition.
    engine.asSouth().endTurn();
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: engine.leader("north"),
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: northId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    // From each player's second turn onward, battling is legal.
    engine.asNorth().endTurn();
    engine.asSouth().attack(southId, engine.asNorth().leader());
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === southId)?.rested,
    ).toBe(true);
    engine.asNorth().chooseCounter();

    engine.asSouth().endTurn();
    engine.asNorth().attack(northId, engine.asSouth().leader());
    expect(
      engine
        .asNorth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === northId)?.rested,
    ).toBe(true);
  });

  test("6-5-6-1: an extra turn does not let the second player battle on their first active turn", () => {
    // If first-turn bans used absolute game-turn indices (P2 banned only on
    // turn 2), an extra turn for the first player would shift P2's first turn
    // to game turn 3 and incorrectly allow them to battle. Per-seat
    // turnsStarted keeps the ban on each seat's first active turn.
    // Public path: OP05-119 On Play grants extraTurn; here we inject the same
    // engine flag the effect sets so the handoff is the unit under test.
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { turnNumber: 1 },
    );
    const northId = engine.asNorth().findOnField(eb01MountainGod018);

    engine.getState().extraTurnSeat = "south";
    engine.asSouth().endTurn();
    // Extra turn: still south, game turn 2 — first player may now battle.
    expect(engine.getState().activeSeat).toBe("south");
    expect(engine.getState().turnNumber).toBe(2);
    expect(engine.getState().players.south.turnsStarted).toBe(2);
    // Prove first player may battle on their second active turn (extra turn).
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    expect(engine.asSouth().view().players.south.leader.rested).toBe(true);

    engine.asSouth().endTurn();
    // Second player's first active turn is now game turn 3, but still banned.
    expect(engine.getState().activeSeat).toBe("north");
    expect(engine.getState().turnNumber).toBe(3);
    expect(engine.getState().players.north.turnsStarted).toBe(1);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: northId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: engine.leader("north"),
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  // 6-5-2 lists "6-5-6. Battle" among Main Phase actions, so a second attack
  // cannot be declared while the current battle is still in progress; an
  // unchecked declaration would overwrite the in-flight battle state.
  test("6-5-6: a second attack cannot be declared while a battle is in progress", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    // The battle is held at the Counter Step by north's [Counter] hand card.
    engine.asNorth().pendingDecision("battleCounter");

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBe("Attacks can only be declared during your main phase.");

    // Once the battle completes, battling is legal again.
    engine.asNorth().chooseCounter();
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    expect(engine.asSouth().view().players.south.leader.rested).toBe(true);
  });

  // Also covers 6-6-1-1-1: an [End of Your Turn] effect activates and resolves
  // only once.
  test("6-6-1-1: [End of Your Turn] effects activate during the End Phase", () => {
    // Baby 5: "[End of Your Turn] You may trash this Character: Set up to 2 of
    // your DON!! cards as active."
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Baby5032, playedOnTurn: 0 }],
      restedDon: 2,
    });

    engine.asSouth().endTurn();

    const activation = engine.asSouth().pendingDecision("effectOptional");
    expect(activation.id).toBeTruthy();
    engine.asSouth().acceptOptional();
    // Choose both rested DON!! cards in the "up to 2" follow-up choice.
    engine.asSouth().chooseSetActiveDon(2);

    const south = engine.asSouth().view().players.south;
    expect(south.trash.map((card) => card.cardId)).toContain(op04Baby5032.id);
    expect(south.restedDon).toBe(0);
    expect(south.activeDon).toBe(2);
    expect(engine.asSouth().view().decisions).toHaveLength(0);
  });

  // Covers 6-6-1-3: "during this turn" effects become invalid after end-of-turn
  // processing.
  test("6-6-1: 'during this turn' modifiers expire when the turn ends", () => {
    // Meteor Fist: "[Main] Give up to 1 of your opponent's Characters -5000
    // power during this turn."
    const engine = OnePieceTestEngine.create(
      { hand: [op13MeteorFist020], activeDon: op13MeteorFist020.cost },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    const targetId = engine.asNorth().findOnField(eb01MountainGod018);
    const targetPower = () =>
      engine
        .asSouth()
        .view()
        .players.north.characters.find((card) => card?.instanceId === targetId)?.power;

    engine.asSouth().play(op13MeteorFist020);
    engine.asSouth().choose("effectTargetSelection", [targetId]);
    expect(targetPower()).toBe(7000 - 5000);

    engine.asSouth().endTurn();
    expect(targetPower()).toBe(7000);
  });

  test("6-6-1-4: the turn ends and the non-turn player becomes the new turn player", () => {
    const engine = OnePieceTestEngine.create({}, {}, { turnNumber: 1 });
    expect(engine.asSouth().view().activeSeat).toBe("south");
    expect(engine.asSouth().view().turnNumber).toBe(1);

    engine.asSouth().endTurn();

    // The next turn has already run Refresh, Draw, and DON!! phases and waits
    // in the Main Phase for the new turn player.
    const view = engine.asSouth().view();
    expect(view.activeSeat).toBe("north");
    expect(view.turnNumber).toBe(2);
    expect(view.phase).toBe("main");
  });
});
