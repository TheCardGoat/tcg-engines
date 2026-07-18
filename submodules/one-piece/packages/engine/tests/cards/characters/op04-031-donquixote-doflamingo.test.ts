import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04DonquixoteDoflamingo031,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-031 Donquixote Doflamingo", () => {
  test("freezes up to three opposing rested Leaders or Characters for the next Refresh only", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04DonquixoteDoflamingo031],
        activeDon: op04DonquixoteDoflamingo031.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01Doma005,
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const northLeaderId = engine.leader("north");
    const firstFrozenId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondFrozenId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const refreshedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeId = engine
      .getView("south")
      .players.north.characters.find(
        (card) => card?.cardId === eb01Doma005.id && card.instanceId !== firstFrozenId,
      )?.instanceId;
    if (!activeId) throw new Error("Expected the active exclusion fixture.");

    engine.declareAttack(northLeaderId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.endTurn("north");
    engine.playCard(op04DonquixoteDoflamingo031, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's freeze targets.");
    expect(target).toMatchObject({ min: 0, max: 3 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      northLeaderId,
      firstFrozenId,
      secondFrozenId,
      refreshedId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [northLeaderId, firstFrozenId, secondFrozenId] },
      "south",
    );

    engine.endTurn("south");
    let view = engine.getView("north");
    expect(view.players.north.leader.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstFrozenId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondFrozenId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === refreshedId)?.rested,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.leader.rested).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstFrozenId)?.rested,
    ).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondFrozenId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may freeze zero opposing cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04DonquixoteDoflamingo031],
        activeDon: op04DonquixoteDoflamingo031.cost,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04DonquixoteDoflamingo031, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.endTurn("south");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
