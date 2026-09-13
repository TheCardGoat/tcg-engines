import { describe, expect, test } from "vite-plus/test";
import {
  eb01EdwardWeevil023,
  eb01MountainGod018,
  eb01Mr9037,
  eb01TonyTonyChopper006,
  op01BoaHancock078,
  op03SanjiSPilaf056,
  op07DragonBreath017,
  op09BennBeckman009,
  op10Sanji005,
  op10Shiryu086,
  op12Sakazuki044,
  op13Bepo035,
  op13GumGumSnakeShot039,
  op13Higuma013,
  op13PaperArtAfterimage115,
  op13SunnyKun026,
  op13TrafalgarLaw031,
  op14eb04Hatchan051,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

// Attack fixtures on "turn 1" must make the active seat the non-first player.
const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Rule 10-2-1: K.O.", () => {
  test("10-2-1-1 and 10-2-1-2: a Character that loses a battle is K.O.'d and placed from the Character area into its owner's trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op13Higuma013, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const targetId = engine.asNorth().findOnField(op13Higuma013);

    engine.asSouth().attack(attackerId, targetId);

    const view = engine.asNorth().view();
    expect(view.players.north.characters.every((card) => card === null)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
  });

  test("10-2-17-1 and 10-2-17-2: [On K.O.] activates on the field when K.O.'d and resolves while the card is in the trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op10Sanji005, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const sanjiId = engine.asNorth().findOnField(op10Sanji005);

    // OP10-005 Sanji: "[On K.O.] Draw 1 card."
    engine.asSouth().attack(attackerId, sanjiId);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.north.hand).toHaveLength(1);
  });

  test("10-2-17-1: a [On K.O.] activation condition is checked on the field before the card leaves", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op14eb04Hatchan051, attachedDon: 2, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const hatchanId = engine.asNorth().findOnField(op14eb04Hatchan051);

    // OP14-051 Hatchan: "[DON!! x2] [On K.O.] Draw 1 card." The [DON!! x2]
    // condition is fulfilled on the field; the attached DON!! only return to
    // the cost area as the card is K.O.'d, so the draw still activates.
    engine.asSouth().attack(attackerId, hatchanId);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(hatchanId);
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.restedDon).toBe(2);
  });

  test("10-2-17-1: a [On K.O.] activation condition not fulfilled on the field does not activate", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op14eb04Hatchan051, attachedDon: 1, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const hatchanId = engine.asNorth().findOnField(op14eb04Hatchan051);

    engine.asSouth().attack(attackerId, hatchanId);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(hatchanId);
    // Only 1 DON!! was attached on the field, so the [DON!! x2] condition failed.
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.restedDon).toBe(1);
  });

  test("10-2-1-1: a Character trashed by an effect that says K.O. is K.O.'d, so [On K.O.] activates", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07DragonBreath017], activeDon: 2 },
      { character: [op10Sanji005] },
    );
    const sanjiId = engine.asNorth().findOnField(op10Sanji005);

    // OP07-017 Dragon Breath: "[Main] K.O. up to 1 of your opponent's Characters with 3000 power or less ..."
    engine.asSouth().play(op07DragonBreath017);
    engine.asSouth().choose("effectTargetSelection", [sanjiId]);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.north.hand).toHaveLength(1);
  });

  test("10-2-1-3: a Character trashed by an effect that does not say K.O. is not treated as K.O.'d, so [On K.O.] does not activate", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09BennBeckman009], activeDon: 7 },
      { character: [op10Sanji005] },
    );
    const sanjiId = engine.asNorth().findOnField(op10Sanji005);

    // OP09-009 Benn Beckman: "[On Play] Trash up to 1 of your opponent's Characters with 6000 power or less."
    engine.asSouth().play(op09BennBeckman009);
    engine.asSouth().choose("effectTargetSelection", [sanjiId]);

    const view = engine.asNorth().view();
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(sanjiId);
    // Sanji's [On K.O.] draw did not activate: the trash was not a K.O.
    expect(view.players.north.hand).toHaveLength(0);
    expect(engine.asNorth().view().decisions).toHaveLength(0);
  });

  test("10-2-1-3: trashing a Character by the 3-7-6-1 rule process is not a K.O.", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Higuma013],
      character: [op10Sanji005, op13Higuma013, op13Higuma013, op13Higuma013, op13Higuma013],
      activeDon: 1,
    });
    const sanjiId = engine.asSouth().findOnField(op10Sanji005);

    // 3-7-6-1: reveal the new Character, trash 1 of the 5 (rule processing,
    // not a K.O.), then play.
    engine.asSouth().play(op13Higuma013);
    engine.asSouth().choose("playCharacterReplacement", [sanjiId]);

    const view = engine.asSouth().view();
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(5);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    // Sanji's [On K.O.] draw did not activate: the trash was not a K.O.
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.asNorth().view().decisions).toHaveLength(0);
  });
});

describe("Rule 10-2-2: [Activate: Main]", () => {
  test("10-2-2-1: an [Activate: Main] effect can be activated during the Main Phase", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SunnyKun026],
      activeDon: 1,
    });
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    // OP13-026 Sunny-Kun: "[Activate: Main] [Once Per Turn] You may rest 1 of your DON!! cards: This Character gains +2000 power ..."
    engine.asSouth().activateMain(sunnyId);
    engine.asSouth().acceptOptional();

    const view = engine.asSouth().view();
    expect(view.players.south.characters.find((card) => card?.instanceId === sunnyId)?.power).toBe(
      4000,
    );
    expect(view.players.south.restedDon).toBe(1);
  });

  test("10-2-2-1: an [Activate: Main] effect cannot be activated during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { activeDon: 1 },
      { character: [op13SunnyKun026], activeDon: 1 },
    );
    const sunnyId = engine.asNorth().findOnField(op13SunnyKun026);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "north",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).reason,
    ).toBe("Effects can only be activated during your main phase.");
  });

  // 10-2-2-1 forbids [Activate: Main] "except when in battle": the phase
  // remains "main" during battle, so the command must also be rejected while
  // a battle is in progress.
  test("10-2-2-1: an [Activate: Main] effect cannot be activated while in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op13SunnyKun026],
        activeDon: 1,
      },
      { character: [eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.acceptLeadingOptional("north");
    engine.pendingDecision("battleBlocker", "north");

    // Expected per 10-2-2-1: rejected. Today the command is accepted mid-battle.
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).reason,
    ).toBe("Effects can only be activated during your main phase.");
  });
});

describe("Rule 10-2-3: [Main]", () => {
  test("10-2-3-1: a [Main] Event can be used during the Main Phase", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03SanjiSPilaf056],
      activeDon: 3,
    });
    const pilafId = engine.asSouth().findInZone("hand", op03SanjiSPilaf056);

    // OP03-056 Sanji's Pilaf: "[Main] Draw 2 cards."
    engine.asSouth().play(op03SanjiSPilaf056);

    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.restedDon).toBe(3);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(pilafId);
  });

  test("10-2-3-1: a [Main] Event cannot be used during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({}, { hand: [op03SanjiSPilaf056], activeDon: 3 });
    const pilafId = engine.asNorth().findInZone("hand", op03SanjiSPilaf056);

    expect(
      engine.expectFailure({
        type: "playCard",
        seat: "north",
        instanceId: pilafId,
      }).reason,
    ).toBe("Cards can only be played during your main phase.");
  });

  // 10-2-3-1 forbids using [Main] Events "except in battle": the phase
  // remains "main" during battle, so the command must also be rejected while
  // a battle is in progress.
  test("10-2-3-1: a [Main] Event cannot be used while in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03SanjiSPilaf056],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const pilafId = engine.asSouth().findInZone("hand", op03SanjiSPilaf056);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.acceptLeadingOptional("north");
    engine.pendingDecision("battleBlocker", "north");

    // Expected per 10-2-3-1: rejected. Today the command is accepted mid-battle.
    expect(
      engine.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: pilafId,
      }).reason,
    ).toBe("Cards can only be played during your main phase.");
  });

  test("10-2-3-1-1: as an exception, a [Trigger] may activate a [Main] effect outside the Main Phase", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op03SanjiSPilaf056] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const pilafId = engine.asNorth().findInZone("life", op03SanjiSPilaf056);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();

    const view = engine.asNorth().view();
    expect(view.players.north.hand).toHaveLength(2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(pilafId);
  });
});

describe("Rule 10-2-4: [Counter]", () => {
  test("10-2-4-1: a [Counter] Event can be used during the opponent's Counter Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13PaperArtAfterimage115], activeDon: 2 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const eventId = engine.asNorth().findInZone("hand", op13PaperArtAfterimage115);
    const lifeBefore = engine.asNorth().view().players.north.lifeCount;

    // OP13-115 Paper Art Afterimage: "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. ..."
    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.acceptLeadingOptional("north");
    const counter = engine.pendingDecision("battleCounter", "north").steps[0];
    expect(counter?.kind).toBe("selectEntity");
    if (counter?.kind !== "selectEntity") throw new Error("Expected a Counter decision.");
    expect(counter.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    engine.asNorth().choose("battleCounter", [eventId]);
    engine.asNorth().choose("effectTargetSelection", [engine.leader("north")]);

    // 7000 attack against 5000 + 3000 defense: the attack fails and no damage is dealt.
    const view = engine.asNorth().view();
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.restedDon).toBe(2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
  });

  test("10-2-4-1: a [Counter] Event cannot be used during your own Main Phase", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13PaperArtAfterimage115],
      activeDon: 2,
    });
    const eventId = engine.asSouth().findInZone("hand", op13PaperArtAfterimage115);

    expect(
      engine.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: eventId,
      }).reason,
    ).toBe("This event does not have a playable [Main] effect.");
  });

  test("10-2-4-1-1 and 10-2-4-1-2: an effect may activate [Counter] when the effect says 'activate [Counter]'", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Shiryu086, playedOnTurn: 0 }] },
      { life: [op13GumGumSnakeShot039] },
      SOUTH_ATTACKS,
    );
    const shiryuId = engine.asSouth().findOnField(op10Shiryu086);
    const snakeShotId = engine.asNorth().findInZone("life", op13GumGumSnakeShot039);

    // OP13-039 Gum-Gum Snake Shot: "[Counter] K.O. up to 1 of your opponent's rested Characters
    // with a cost of 4 or less." [Trigger] "Activate this card's [Counter] effect."
    engine.asSouth().attack(shiryuId, engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();
    engine.asNorth().choose("effectTargetSelection", [shiryuId]);

    // The activated [Counter] K.O.'d the rested 5000-power attacker after damage was dealt.
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.instanceId),
    ).toContain(shiryuId);
    expect(
      engine
        .asNorth()
        .view()
        .players.north.trash.map((card) => card.instanceId),
    ).toContain(snakeShotId);
  });
});

describe("Rule 10-2-5: [When Attacking]", () => {
  test("10-2-5-1: a [When Attacking] effect activates when an attack is declared during the Attack Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01BoaHancock078, playedOnTurn: 0, attachedDon: 1 }] },
      {},
      SOUTH_ATTACKS,
    );
    const boaId = engine.asSouth().findOnField(op01BoaHancock078);

    // OP01-078 Boa Hancock: "[DON!! x1] [When Attacking]/[On Block] Draw 1 card if you have 5 or less cards in your hand."
    engine.asSouth().attack(boaId, engine.asNorth().leader());

    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);
  });
});

describe("Rule 10-2-6: [On Play]", () => {
  test("10-2-6-1: an [On Play] effect activates when the card is played", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01EdwardWeevil023],
      activeDon: 4,
    });

    // EB01-023 Edward Weevil: "[On Play] Draw 1 card."
    engine.asSouth().play(eb01EdwardWeevil023);

    const view = engine.asSouth().view();
    expect(view.players.south.hand).toHaveLength(1);
    expect(
      view.players.south.characters.some((card) => card?.cardId === eb01EdwardWeevil023.id),
    ).toBe(true);
  });
});

describe("Rule 10-2-7 and 10-2-8: [End of Your Turn] and [End of Your Opponent's Turn]", () => {
  test("10-2-7-1: an [End of Your Turn] effect activates and resolves once at the End Phase of your turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op13Bepo035, rested: true }],
    });
    const bepoId = engine.asSouth().findOnField(op13Bepo035);

    // OP13-035 Bepo: "[End of Your Turn] Set this Character or up to 1 of your DON!! cards as active."
    engine.asSouth().endTurn();
    engine.asSouth().chooseOption("effectActionChoice", "0");

    const view = engine.asSouth().view();
    expect(view.players.south.characters.find((card) => card?.instanceId === bepoId)?.rested).toBe(
      false,
    );
    expect(engine.asSouth().view().decisions).toHaveLength(0);
  });

  test("10-2-7-1: an [End of Your Turn] effect does not activate at the End Phase of the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {},
      { character: [{ card: op13Bepo035, rested: true }] },
    );

    // South ends its turn; north's Bepo only activates at the End Phase of north's own turn,
    // so no end-of-turn choice is projected to north during south's End Phase.
    engine.asSouth().endTurn();

    expect(() => engine.pendingDecision("effectActionChoice", "north")).toThrow();
  });

  // NON-EXECUTABLE: 10-2-8 [End of Your Opponent's Turn] — no card in the @tcg/op-cards catalog
  // carries this keyword (verified by grep over effect text and structured triggers), so there is
  // no real card through which the timing can be exercised.
});

describe("Rule 10-2-9: [DON!! xX]", () => {
  test("10-2-9-1: the condition is satisfied when the card is given exactly X DON!! cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01BoaHancock078, playedOnTurn: 0, attachedDon: 1 }] },
      {},
      SOUTH_ATTACKS,
    );
    const boaId = engine.asSouth().findOnField(op01BoaHancock078);

    engine.asSouth().attack(boaId, engine.asNorth().leader());

    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);
  });

  test("10-2-9-1: the condition is satisfied when the card is given more than X DON!! cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01BoaHancock078, playedOnTurn: 0, attachedDon: 2 }] },
      {},
      SOUTH_ATTACKS,
    );
    const boaId = engine.asSouth().findOnField(op01BoaHancock078);

    engine.asSouth().attack(boaId, engine.asNorth().leader());

    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);
  });

  test("10-2-9-1: the condition is not satisfied when fewer than X DON!! cards are given", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01BoaHancock078, playedOnTurn: 0 }] },
      {},
      SOUTH_ATTACKS,
    );
    const boaId = engine.asSouth().findOnField(op01BoaHancock078);

    engine.asSouth().attack(boaId, engine.asNorth().leader());

    expect(engine.asSouth().view().players.south.hand).toHaveLength(0);
  });
});

describe("Rule 10-2-10: DON!! -X", () => {
  test("10-2-10-1: DON!! -X returns DON!! cards from the field to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }, op13SunnyKun026],
      },
      { character: [{ card: eb01Mr9037, attachedDon: 1 }] },
      SOUTH_ATTACKS,
    );
    const mr9Id = engine.asNorth().findOnField(eb01Mr9037);
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);
    const donDeckBefore = engine.asNorth().view().players.north.donDeckCount;

    // EB01-037 Mr. 9: "[On Your Opponent's Attack] [Once Per Turn] DON!! -1: K.O. up to 1 of your
    // opponent's Characters with a cost of 2 or less."
    engine.declareAttack(
      engine.asSouth().findOnField(op13Higuma013),
      engine.leader("north"),
      "south",
    );
    engine.asNorth().choose("effectTargetSelection", [sunnyId]);

    const view = engine.asNorth().view();
    expect(
      view.players.north.characters.find((card) => card?.instanceId === mr9Id)?.attachedDon,
    ).toBe(0);
    expect(view.players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.restedDon).toBe(0);
  });
});

describe("Rule 10-2-11 and 10-2-12: [Your Turn] and [Opponent's Turn]", () => {
  test("10-2-11-1: a [Your Turn] condition is satisfied during your turn and not during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Sanji005],
    });
    const sanjiId = engine.asSouth().findOnField(op10Sanji005);

    // OP10-005 Sanji: "[Your Turn] This Character gains +3000 power."
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === sanjiId)?.power,
    ).toBe(6000);

    engine.asSouth().endTurn();

    expect(
      engine
        .asNorth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === sanjiId)?.power,
    ).toBe(3000);
  });

  test("10-2-12-1: an [Opponent's Turn] condition is satisfied during your opponent's turn and not during your turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Shiryu086],
    });
    const shiryuId = engine.asSouth().findOnField(op10Shiryu086);

    // OP10-086 Shiryu: "[Opponent's Turn] This Character gains +2000 power."
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === shiryuId)?.power,
    ).toBe(5000);

    engine.asSouth().endTurn();

    expect(
      engine
        .asNorth()
        .view()
        .players.south.characters.find((card) => card?.instanceId === shiryuId)?.power,
    ).toBe(7000);
  });
});

describe("Rule 10-2-13: [Once Per Turn]", () => {
  test("10-2-13-1 and 10-2-13-3: a [Once Per Turn] effect resolves once and cannot be activated or have its cost paid again that turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SunnyKun026],
      activeDon: 2,
    });
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().activateMain(sunnyId);
    engine.asSouth().acceptOptional();
    expect(engine.asSouth().view().players.south.restedDon).toBe(1);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    // The activation cost was not paid a second time.
    expect(engine.asSouth().view().players.south.restedDon).toBe(1);
  });

  test("10-2-13-2: with multiple cards that have the same effect, each card may activate its [Once Per Turn] effect once", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SunnyKun026, op13SunnyKun026],
      activeDon: 2,
    });
    const sunnyIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op13SunnyKun026.id)
      .map((card) => card!.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    expect(sunnyIds).toHaveLength(2);

    engine.asSouth().activateMain(sunnyIds[0]!);
    engine.asSouth().acceptOptional();
    engine.asSouth().activateMain(sunnyIds[1]!);
    engine.asSouth().acceptOptional();

    expect(engine.asSouth().view().players.south.restedDon).toBe(2);
  });

  // 10-2-13-4 (with 3-1-6): moveCard resets usedEffectKeys when an instance
  // leaves the field (state.ts), so the returned-and-replayed card below is
  // treated as a different card and may activate its [Once Per Turn] effect again.
  test("10-2-13-4: a card that left the field and appeared again is treated as a different card and may activate its [Once Per Turn] effect again", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TrafalgarLaw031],
      character: [op13SunnyKun026],
      // 6 DON!! for Law plus 1 rested for each of the two Sunny-Kun activations.
      activeDon: 8,
    });
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().activateMain(sunnyId);
    engine.asSouth().acceptOptional();

    // OP13-031 Trafalgar Law: "[On Play] You may return 1 of your Characters to the owner's hand:
    // Play up to 1 Character card with a cost of 5 or less from your hand rested."
    engine.asSouth().play(op13TrafalgarLaw031);
    engine.asSouth().acceptOptional();
    engine.acceptLeadingOptional("south");
    const payment = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected a return-to-hand cost decision.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(sunnyId);
    engine.asSouth().choose("effectCostReturnCharacter", [sunnyId]);
    const returnedSunnyId = engine.asSouth().findInZone("hand", op13SunnyKun026);
    expect(returnedSunnyId).toBe(sunnyId);
    engine.asSouth().choose("effectPlaySelection", [returnedSunnyId]);

    const replayedSunnyId = engine.asSouth().findOnField(op13SunnyKun026);
    // The returned Sunny-Kun left the field and appeared again, so it is treated as a different
    // card per 3-1-6 and its [Once Per Turn] effect may be activated again this turn.
    engine.asSouth().activateMain(replayedSunnyId);
    engine.asSouth().acceptOptional();

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === replayedSunnyId)?.power,
    ).toBe(4000);
  });

  // GAP: test-harness — 10-2-13-5 (a failed activation-cost payment still spends the
  // [Once Per Turn]) requires becoming unable to pay mid-payment. The public command API
  // validates costs atomically up front, so no command sequence can reach that state.
});

describe("Rule 10-2-14: Trash", () => {
  test("10-2-14-1: a Trash cost selects a card from the hand and places it in the trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Higuma013, op13SunnyKun026],
      character: [op12Sakazuki044],
      restedDon: 1,
    });
    const sakazukiId = engine.asSouth().findOnField(op12Sakazuki044);
    const higumaId = engine.asSouth().findInZone("hand", op13Higuma013);
    const sunnyId = engine.asSouth().findInZone("hand", op13SunnyKun026);

    // OP12-044 Sakazuki: "[Activate: Main] [Once Per Turn] You may trash 1 card from your hand:
    // Give up to 1 rested DON!! card to your Leader or 1 of your Characters."
    engine.asSouth().activateMain(sakazukiId);
    engine.asSouth().acceptOptional();
    engine.acceptLeadingOptional("south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected a trash-from-hand decision.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([higumaId, sunnyId]),
    );
    engine.asSouth().choose("effectCostTrashFromHand", [higumaId]);
    engine.asSouth().chooseOption("effectGiveDonCount", "1");
    engine.asSouth().choose("effectTargetSelection", [engine.leader("south")]);

    const view = engine.asSouth().view();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(higumaId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([sunnyId]);
    // The post-cost action resolved: the rested DON!! was given to the Leader.
    expect(view.players.south.leader?.attachedDon).toBe(1);
  });
});

describe("Rule 10-2-15: [On Block]", () => {
  test("10-2-15-1: an [On Block] effect activates during the Block Step when you activate your [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op01BoaHancock078, attachedDon: 1 }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const boaId = engine.asNorth().findOnField(op01BoaHancock078);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().chooseBlocker(boaId);

    // The [On Block] draw resolved immediately after the blocker was activated.
    const view = engine.asNorth().view();
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.characters.find((card) => card?.instanceId === boaId)?.rested).toBe(
      true,
    );
  });

  test("10-2-15-1: an [On Block] effect does not activate when the [Blocker] is not activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op01BoaHancock078, attachedDon: 1 }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().chooseBlocker();

    // No [On Block] draw: the only new hand card is the Life card taken as damage.
    const view = engine.asNorth().view();
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.lifeCount).toBe(3);
  });
});

describe("Rule 10-2-16: [On Your Opponent's Attack]", () => {
  test("10-2-16-1: an [On Your Opponent's Attack] effect activates after the opponent's Attack Step effects when an attack is declared", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01BoaHancock078, playedOnTurn: 0, attachedDon: 1 }, op13SunnyKun026],
      },
      { character: [{ card: eb01Mr9037, attachedDon: 1 }] },
      SOUTH_ATTACKS,
    );
    const boaId = engine.asSouth().findOnField(op01BoaHancock078);
    const sunnyId = engine.asSouth().findOnField(op13SunnyKun026);

    engine.asSouth().attack(boaId, engine.asNorth().leader());

    // The attacker's [When Attacking] Attack Step effect has already resolved ...
    expect(engine.asSouth().view().players.south.hand).toHaveLength(1);
    // ... and the defender's [On Your Opponent's Attack] effect activates afterwards.
    engine.acceptLeadingOptional("north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected a target decision.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(sunnyId);
    engine.asNorth().choose("effectTargetSelection", [sunnyId]);

    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.instanceId),
    ).toContain(sunnyId);
  });
});
