import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op01RoronoaZoro025,
  op02Minotaur087,
  op03Curiel004,
  op03Minozebra068,
  op04Chaka008,
  op13GumGumGatlingGun021,
  op13Higuma013,
  op14eb04Terracotta024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

// Mid-game default is turn 3 (past 6-5-6-1). When pinning turnNumber: 1, set
// the attacker as the non-first player so the seat is not first-turn banned.
const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Comprehensive Rules 10-1: Keyword Effects", () => {
  test("10-1-1-1: [Rush] allows a Character to attack during the turn in which it is played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01RoronoaZoro025], activeDon: 3 },
      { life: 4 },
      SOUTH_ATTACKS,
    );
    const lifeBefore = engine.asNorth().view().players.north.lifeCount;

    engine.asSouth().play(op01RoronoaZoro025);
    const zoroId = engine.asSouth().findOnField(op01RoronoaZoro025);
    engine.asSouth().attack(zoroId, engine.asNorth().leader());

    expect(engine.asNorth().view().players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("10-1-1-1 boundary: a Character without [Rush] cannot attack during the turn in which it is played", () => {
    // playedOnTurn must match the fixture turnNumber (default mid-game is 3).
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 3 }] },
      {},
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  test("10-1-1-1 with 6-5-6-1: [Rush] does not let either player attack on their first turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01RoronoaZoro025], activeDon: 3 },
      { hand: [op01RoronoaZoro025], activeDon: 3, life: 4 },
      { turnNumber: 1 },
    );

    // First player's first turn.
    engine.asSouth().play(op01RoronoaZoro025);
    const southZoro = engine.asSouth().findOnField(op01RoronoaZoro025);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: southZoro,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    // Second player's first turn: [Rush] still cannot override 6-5-6-1.
    engine.asSouth().endTurn();
    engine.asNorth().play(op01RoronoaZoro025);
    const northZoro = engine.asNorth().findOnField(op01RoronoaZoro025);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: northZoro,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  test("10-1-2-1: [Double Attack] deals 2 damage to the opponent Leader's Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Minotaur087, playedOnTurn: 0 }] },
      { life: 4 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op02Minotaur087);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    expect(engine.asNorth().view().players.north.lifeCount).toBe(2);
    expect(engine.asNorth().view().players.north.hand).toHaveLength(2);
  });

  test("10-1-3-1: [Banish] trashes the damaged Life card without activating its [Trigger]", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Minozebra068, playedOnTurn: 0 }] },
      { life: [op13GumGumGatlingGun021, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(op03Minozebra068);
    const banishedId = engine.asNorth().findInZone("life", op13GumGumGatlingGun021);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asNorth().view();
    expect(view.decisions).toHaveLength(0);
    expect(view.players.north.lifeCount).toBe(3);
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(banishedId);
  });

  test("10-1-3-1 control: the same Life card offers its [Trigger] when damaged by a non-[Banish] attacker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13GumGumGatlingGun021, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    expect(engine.asNorth().pendingDecision("lifeTrigger").id).toBeTruthy();
  });

  test("10-1-4-1: [Blocker] rests to take the attack's place when your Leader is attacked", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [eb01TonyTonyChopper006], life: 4 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const blockerId = engine.asNorth().findOnField(eb01TonyTonyChopper006);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    const step = engine.asNorth().pendingDecision("battleBlocker").steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.asNorth().chooseBlocker(blockerId);

    const view = engine.asNorth().view();
    // The 7000-power attacker battles the 4000-power Blocker instead of the Leader.
    expect(view.players.north.lifeCount).toBe(4);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(blockerId);
  });

  test("10-1-4-1: [Blocker] activates only when another of your cards is attacked, once per battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01TonyTonyChopper006, rested: true },
          eb01TonyTonyChopper006,
          eb01TonyTonyChopper006,
        ],
        life: 4,
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const attackedId = engine
      .getView("north")
      .players.north.characters.find(
        (card) => card?.cardId === eb01TonyTonyChopper006.id && card.rested,
      )?.instanceId;
    if (!attackedId) throw new Error("Expected a rested Blocker target.");

    engine.asSouth().attack(attackerId, attackedId);
    const step = engine.asNorth().pendingDecision("battleBlocker").steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    // The attacked card cannot take its own place; only the other two Blockers qualify.
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackedId);
    expect(step.candidates).toHaveLength(3);
    const activeBlockerIds = step.candidates
      .map((candidate) => candidate.ref.id)
      .filter((id) => id !== "skip");
    // Only one [Blocker] may be activated during a single battle.
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "north",
      promptId: step.id,
      selectedIds: activeBlockerIds,
    });
    engine.asNorth().choose("battleBlocker", [activeBlockerIds[0]!]);

    const view = engine.asNorth().view();
    // The activated Blocker is K.O.'d in the attacked card's place; the attacked card survives.
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(activeBlockerIds[0]!);
    expect(view.players.north.characters.some((card) => card?.instanceId === attackedId)).toBe(
      true,
    );
  });

  test("10-1-4-1 boundary: a rested [Blocker] cannot be activated during the Block Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01TonyTonyChopper006, rested: true }], life: 4 },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());

    const view = engine.asNorth().view();
    expect(view.decisions).toHaveLength(0);
    expect(view.players.north.lifeCount).toBe(3);
  });

  test("10-1-5-1 and 10-1-5-3: a damaged [Trigger] card may be revealed and activated, is in no area while resolving, and is trashed afterward", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13GumGumGatlingGun021, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const triggerId = engine.asNorth().findInZone("life", op13GumGumGatlingGun021);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().activateLifeTrigger();

    // 10-1-5-3: while the [Trigger] resolves, the card belongs to no ordinary area.
    expect(engine.asNorth().findInZone("resolution", op13GumGumGatlingGun021)).toBe(triggerId);
    expect(
      engine
        .asNorth()
        .view()
        .players.north.hand.some((card) => card.instanceId === triggerId),
    ).toBe(false);
    expect(
      engine
        .asNorth()
        .view()
        .players.north.trash.some((card) => card.instanceId === triggerId),
    ).toBe(false);

    // [Trigger] Give up to 1 of your opponent's Characters -2000 power during this turn.
    engine.asNorth().choose("effectTargetSelection", [attackerId]);

    const view = engine.asNorth().view();
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(5000);
    // 10-1-5-3: after the [Trigger] finishes, the card is trashed unless otherwise specified.
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.hand.some((card) => card.instanceId === triggerId)).toBe(false);
    expect(view.players.north.lifeCount).toBe(3);
  });

  test("10-1-5-2: declining the [Trigger] adds the damaged card to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13GumGumGatlingGun021, "OP13-013", "OP13-013", "OP13-013"] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.asSouth().findOnField(eb01MountainGod018);
    const triggerId = engine.asNorth().findInZone("life", op13GumGumGatlingGun021);

    engine.asSouth().attack(attackerId, engine.asNorth().leader());
    engine.asNorth().declineLifeTrigger();

    const view = engine.asNorth().view();
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.lifeCount).toBe(3);
  });

  test("10-1-6-1: [Rush: Character] may attack only Characters on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Curiel004], activeDon: 3 },
      { character: [{ card: op13Higuma013, rested: true }], life: 4 },
      SOUTH_ATTACKS,
    );

    engine.asSouth().play(op03Curiel004);
    const curielId = engine.asSouth().findOnField(op03Curiel004);
    const higumaId = engine.asNorth().findOnField(op13Higuma013);

    // The Leader is still not a legal target on the played turn.
    engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: curielId,
      targetId: engine.leader("north"),
    });
    // An opposing Character remains a legal target on the played turn.
    engine.asSouth().attack(curielId, higumaId);

    expect(
      engine
        .asNorth()
        .view()
        .players.north.trash.map((card) => card.instanceId),
    ).toContain(higumaId);
  });

  test("10-1-7-1: [Unblockable] prevents the opponent from activating [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [op14eb04Terracotta024, { card: op04Chaka008, playedOnTurn: 0 }],
      },
      { character: [eb01TonyTonyChopper006], life: 4 },
      SOUTH_ATTACKS,
    );
    const terracottaId = engine.asSouth().findOnField(op14eb04Terracotta024);
    const chakaId = engine.asSouth().findOnField(op04Chaka008);
    const blockerId = engine.asNorth().findOnField(eb01TonyTonyChopper006);

    // Terracotta grants Chaka [Unblockable] during this turn.
    engine.asSouth().activateMain(terracottaId);
    engine.asSouth().acceptOptional();
    engine.asSouth().choose("effectTargetSelection", [chakaId]);

    engine.asSouth().attack(chakaId, engine.asNorth().leader());

    const view = engine.asNorth().view();
    // No Block Step decision is offered and the attack reaches the Leader's Life.
    expect(() => engine.asNorth().pendingDecision("battleBlocker")).toThrow();
    expect(view.decisions).toHaveLength(0);
    expect(view.players.north.lifeCount).toBe(3);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
  });

  test("10-1-7-1 control: without [Unblockable] the same attack offers the opponent's [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Chaka008, playedOnTurn: 0 }] },
      { character: [eb01TonyTonyChopper006], life: 4 },
      SOUTH_ATTACKS,
    );
    const chakaId = engine.asSouth().findOnField(op04Chaka008);
    const blockerId = engine.asNorth().findOnField(eb01TonyTonyChopper006);

    engine.asSouth().attack(chakaId, engine.asNorth().leader());

    const step = engine.asNorth().pendingDecision("battleBlocker").steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
  });
});
