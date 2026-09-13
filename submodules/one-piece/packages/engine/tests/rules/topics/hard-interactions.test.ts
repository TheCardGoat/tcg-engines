/**
 * Hardest-case official OP TCG interactions.
 *
 * Research inventory: `docs/hard-interaction-research.md`.
 * Sources: CR 1.2.0, official set Q&A PDFs, OP-01 “up to” errata announcement.
 */
import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Caribou007,
  op01Otama006,
  op04Gyats080,
  op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038,
  op10Shiryu086,
  op10Usopp042,
  op13GumGumSnakeShot039,
  op13PortgasDAce002,
  op13SunnyKun026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const NORTH_ATTACKS = { firstPlayer: "south", activeSeat: "north" } as const;

describe("Hard official interactions", () => {
  // ---------------------------------------------------------------------------
  // (a) Once Per Turn — decline does not spend
  // CR 8-1-2 / 10-2-13; OP12 Q&A: player may choose not to activate OPT.
  // ---------------------------------------------------------------------------
  test("hard: OPT decline does not spend once-per-turn (Sunny-Kun)", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SunnyKun026],
      activeDon: 2,
    });
    const south = engine.asSouth();
    const sunnyId = south.findOnField(op13SunnyKun026);

    // First window: open Activate: Main, then decline the optional paid effect.
    south.activateMain(op13SunnyKun026);
    south.declineOptional();
    expect(south.view().players.south.restedDon).toBe(0);
    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === sunnyId)?.power,
    ).toBe(2000);

    // Decline must not consume [Once Per Turn] — a second activation is legal.
    south.activateMain(op13SunnyKun026);
    south.acceptOptional();
    expect(south.view().players.south.restedDon).toBe(1);
    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === sunnyId)?.power,
    ).toBe(4000);

    // After a successful activation, the budget is spent.
    expect(
      south.expectFailure({
        type: "activateEffect",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });

  test("hard: OPT reactive decline leaves a later same-turn window (Usopp OP10-042)", () => {
    // Official pattern (e.g. OP12 Koala Q&A): player may choose not to activate
    // an optional [Once Per Turn] when its condition is met; a later distinct
    // qualifying event the same turn may still offer it.
    // Usopp: [Opponent's Turn][Once Per Turn] when a Dressrosa Character is
    // removed by the opponent, if hand ≤5, draw 1.
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [
          { card: op04Gyats080, rested: true },
          { card: op04Gyats080, rested: true },
        ],
        hand: [],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        life: 3,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      NORTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const gyatsIds = south
      .view()
      .players.south.characters.filter((card) => card?.cardId === op04Gyats080.id)
      .map((card) => card!.instanceId!);
    expect(gyatsIds).toHaveLength(2);
    const attackers = north
      .view()
      .players.north.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId!);

    // First Dressrosa is K.O.'d in battle by the opponent — Usopp MUST open.
    north.attack(attackers[0]!, gyatsIds[0]!);
    expect(south.pendingDecision("effectOptional")).toBeTruthy();
    south.declineOptional();

    const deckAfterFirst = south.view().players.south.deckCount;
    expect(south.view().players.south.handCount).toBe(0);

    // Second Dressrosa removal the same turn must still open Usopp (OPT not spent).
    north.attack(attackers[1]!, gyatsIds[1]!);
    expect(south.pendingDecision("effectOptional")).toBeTruthy();
    south.acceptOptional();

    expect(south.view().players.south.handCount).toBe(1);
    expect(south.view().players.south.deckCount).toBe(deckAfterFirst - 1);
  });

  // ---------------------------------------------------------------------------
  // (b) Life Trigger timing vs when-you-take-damage
  // Official FAQ OP-13 Ace: Trigger is processed first upon taking damage.
  // ---------------------------------------------------------------------------
  test("hard: Life Trigger is offered before when-you-take-damage leader reaction (Ace)", () => {
    // FAQ OP-13 Ace: upon taking damage, process the Life [Trigger] first.
    // Ace [DON!! x1] whenYouTakeDamage requires attached DON!! on Ace (the
    // effect source), not on a teammate Character — attach via public command.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 0,
      },
      {
        leaderCardId: op13PortgasDAce002,
        life: [op13GumGumSnakeShot039, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [],
        activeDon: 1,
        deck: [eb01MountainGod018, eb01Doma005, eb01Doma005],
      },
      // North starts so they can attach DON!! to Ace before taking damage.
      { firstPlayer: "south", activeSeat: "north" },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    north.attachDon(north.leader(), 1);
    expect(north.view().players.north.leader.attachedDon).toBe(1);
    north.endTurn();

    // South's turn: attack Ace for 1 damage. Ace's [On Your Opponent's Attack]
    // needs a hand trash cost — empty hand means it does not open, so the
    // battle proceeds to damage and lifeTrigger.
    south.attack(eb01MountainGod018, north.leader());

    // Damage Step: Life Trigger first; Ace draw must not have fired yet.
    expect(north.pendingDecision("lifeTrigger")).toBeTruthy();
    expect(north.view().players.north.handCount).toBe(0);
    expect(north.view().players.north.lifeCount).toBe(3);

    north.declineLifeTrigger();

    const after = north.view();
    // Skipped Trigger Life card to hand + Ace whenYouTakeDamage draw.
    expect(after.players.north.lifeCount).toBe(3);
    expect(after.players.north.handCount).toBe(2);
    expect(after.players.north.hand.some((card) => card.cardId === op13GumGumSnakeShot039.id)).toBe(
      true,
    );
  });

  // ---------------------------------------------------------------------------
  // (c) Mid-battle / Counter removal of attacker
  // CR 7-1-3-3; OP05 Q&A (KO attacker mid-Counter).
  // ---------------------------------------------------------------------------
  test("hard: Counter Event K.O. of attacker ends battle without Life damage", () => {
    // Proven path (CR 7-1-3-3): Counter Event rests then K.O.s the attacker
    // (OP04-038). Battle ends with no Life damage.
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038],
        activeDon: 5,
        life: 4,
        deck: 6,
      },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const attackerId = south.findOnField(eb01MountainGod018);
    const eventId = north.findInZone("hand", op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038);
    const lifeBefore = north.view().players.north.lifeCount;

    south.attack(eb01MountainGod018, north.leader());
    north.choose("battleCounter", [eventId]);
    // Rest the Leader is allowed but we rest is already on attacker; KO rested
    // Character cost ≤6 (Mountain God is 5).
    north.choose("effectTargetSelection", [south.leader()]);
    north.choose("effectTargetSelection", [attackerId]);

    expect(south.view().battle).toBeNull();
    expect(north.view().players.north.lifeCount).toBe(lifeBefore);
    expect(south.view().players.south.trash.map((card) => card.instanceId)).toContain(attackerId);
  });

  // ---------------------------------------------------------------------------
  // (d) Official OP-01 “up to” errata
  // https://en.onepiece-cardgame.com/rules/announcements/op01.php
  // ---------------------------------------------------------------------------
  test("hard: OP-01 up-to errata — Caribou On K.O. may choose 0 targets", () => {
    // Errata: "K.O. 1 of your opponent's Characters with 4000 power or less"
    // is "K.O. up to 1 …" — choosing 0 is legal. Caribou must be rested to be
    // a legal attack target for the battle K.O. that triggers On K.O.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Caribou007, playedOnTurn: 0, rested: true }],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op04Gyats080],
      },
      NORTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const caribouId = south.findOnField(op01Caribou007);
    const gyatsId = north.findOnField(op04Gyats080);
    const mountainId = north.findOnField(eb01MountainGod018);

    north.attack(mountainId, caribouId);
    // Caribou On K.O.: up to 1 opponent Character ≤4000 power.
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Caribou On K.O. target choice.");
    expect(step.min).toBe(0);
    expect(step.candidates.map((c) => c.ref.id)).toContain(gyatsId);

    south.chooseNoTargets();

    // Opponent's Gyats survives; Caribou is in trash.
    expect(south.view().players.south.trash.map((card) => card.instanceId)).toContain(caribouId);
    expect(north.view().players.north.characters.some((card) => card?.instanceId === gyatsId)).toBe(
      true,
    );
  });

  test("hard: OP-01 up-to errata — Otama On Play may choose 0 power targets", () => {
    // Errata: “Give 1 of your opponent's Characters −2000” → “up to 1”.
    const engine = OnePieceTestEngine.create(
      { hand: [op01Otama006], activeDon: op01Otama006.cost },
      { character: [eb01MountainGod018] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const mountainId = north.findOnField(eb01MountainGod018);
    const powerBefore =
      north.view().players.north.characters.find((card) => card?.instanceId === mountainId)
        ?.power ?? 7000;

    south.play(op01Otama006);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Otama On Play target choice.");
    expect(step.min).toBe(0);
    expect(step.candidates.map((c) => c.ref.id)).toContain(mountainId);

    south.chooseNoTargets();

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === mountainId)?.power,
    ).toBe(powerBefore);
    expect(south.findOnField(op01Otama006)).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // Bonus hard path: Life Trigger activates Counter-printed effect without
  // paying Event cost (Trigger activation ≠ hand Event Counter activation).
  // ---------------------------------------------------------------------------
  test("hard: Life Trigger of a Counter Event activates without paying the Event cost", () => {
    // OP13-039 Snake Shot: [Trigger] Activate this card's [Counter] effect.
    // Counter K.O.s a rested Character cost ≤4 — without paying Event cost.
    // Pattern matches 10-keywords.test.ts 10-2-4-1 (Trigger activate Counter).
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Shiryu086, playedOnTurn: 0 }],
      },
      {
        life: [op13GumGumSnakeShot039],
        activeDon: 0,
        deck: 4,
      },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    // Shiryu is cost 4 / power 5000 and rests when attacking — legal Snake Shot target.
    const shiryuId = south.findOnField(op10Shiryu086);
    const snakeShotId = north.findInZone("life", op13GumGumSnakeShot039);

    south.attack(op10Shiryu086, north.leader());
    north.activateLifeTrigger();
    north.chooseTargets(op10Shiryu086);

    // No Event cost paid from cost area.
    expect(north.view().players.north.activeDon).toBe(0);
    expect(north.view().players.north.restedDon).toBe(0);
    // Counter effect ran: attacker is K.O.'d; Trigger card ends in trash.
    expect(south.view().players.south.trash.map((card) => card.instanceId)).toContain(shiryuId);
    expect(north.view().players.north.trash.map((card) => card.instanceId)).toContain(snakeShotId);
  });
});
