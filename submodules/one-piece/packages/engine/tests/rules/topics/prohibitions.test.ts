/**
 * Topic suite: prohibiting effects vs required actions (CR 1-3-3).
 *
 * Sample families: cannot rest (activation cost), cannot attack Leader.
 */
import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb03Camie015,
  op06Koushirou026,
  op13Higuma013,
  op13NicoRobin032,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Rules topics: prohibiting effects (1-3-3)", () => {
  test("1-3-3: cannot-be-rested blocks an activation that requires resting the Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: 7 },
      { character: [eb03Camie015] },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const camieId = north.findOnField(eb03Camie015);

    south.play(op13NicoRobin032);
    south.chooseTargets(eb03Camie015);
    south.endTurn();

    // Camie pays restThisCard; Robin's permanent forbids resting her.
    expect(
      north.expectFailure({
        type: "activateEffect",
        sourceInstanceId: camieId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
  });

  test("1-3-3: cannot-be-rested keeps the protected card active after the controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: 7 },
      { character: [eb03Camie015] },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const camieId = north.findOnField(eb03Camie015);

    south.play(op13NicoRobin032);
    south.chooseTargets(eb03Camie015);
    south.endTurn();

    // North cannot rest Camie via her activation; she remains active.
    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === camieId)?.rested,
    ).toBe(false);
    expect(north.view().status).toBe("active");
  });

  test("1-3-3: Koushirou's Leader-attack prohibition rejects attacking the Leader", () => {
    // OP06-026: after On Play, "you cannot attack a Leader during this turn."
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Koushirou026],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: op06Koushirou026.cost,
      },
      { life: 4, deck: 6 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const attackerId = south.findOnField(eb01MountainGod018);

    south.play(op06Koushirou026);
    // Optional set-active may appear; decline if present.
    if (south.hasPendingChoice()) {
      try {
        south.chooseNoTargets();
      } catch {
        south.declineOptional();
      }
    }

    expect(
      south.expectFailure({
        type: "declareAttack",
        attackerId,
        targetId: north.leader(),
      }).reason,
    ).toMatch(/cannot be attacked|cannot attack/i);
  });

  test("1-3-3: Leader-attack prohibition does not block attacking a rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Koushirou026],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: op06Koushirou026.cost,
      },
      { character: [{ card: op13Higuma013, rested: true }], life: 4, deck: 6 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();

    south.play(op06Koushirou026);
    if (south.hasPendingChoice()) {
      try {
        south.chooseNoTargets();
      } catch {
        south.declineOptional();
      }
    }

    // Character attack remains legal under the Leader-only restriction.
    south.attack(eb01MountainGod018, op13Higuma013);
    expect(
      south.view().players.south.characters.find((card) => card?.cardId === eb01MountainGod018.id)
        ?.rested,
    ).toBe(true);
  });
});
