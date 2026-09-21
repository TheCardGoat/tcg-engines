import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02GumGumGiantPistol021,
  op02IceAge117,
  op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
} from "@tcg/op-cards";
import { op03Kuroobi026 } from "../../../../../cards/src/cards/characters/op03-026-kuroobi.ts";
import { op15Lucy002 } from "../../../../../cards/src/cards/leaders/op15-002-lucy.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

function leaderActivationIsLegal(engine: OnePieceTestEngine): boolean {
  return getLegalCommands(engine.getState(), "south").some(
    (command) => command.type === "activateEffect" && command.sourceId === engine.leader("south"),
  );
}

describe("OP15-002 Lucy", () => {
  test("[When Attacking] trashes chosen Events and gains +1000 power per trashed card for the battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Lucy002,
        activeDon: 2,
        hand: [eb02GumGumGiantPistol021, eb02GumGumGiantPistol021, op03Kuroobi026],
      },
      { hand: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const counterId = engine.findCardInZone(
      "north",
      "hand",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Lucy's trash selection.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toHaveLength(2);
    const selected = trash.candidates.map((candidate) => candidate.ref.id).slice(0, 2);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: selected }, "south");

    const counter = engine.pendingDecision("battleCounter", "north").steps[0];
    expect(counter?.kind).toBe("selectEntity");
    expect(engine.getView("south").players.south.leader?.power).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [counterId] }, "north");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").players.south.trash).toHaveLength(2);
    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "OP03-026",
    ]);
  });

  test("[Activate: Main] draws only after activating an Event with base cost 3 or more", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Lucy002,
        activeDon: 6,
        hand: [op02IceAge117, eb02GumGumGiantPistol021],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    expect(leaderActivationIsLegal(engine)).toBe(false);

    engine.playCard(op02IceAge117);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(leaderActivationIsLegal(engine)).toBe(false);

    engine.playCard(eb02GumGumGiantPistol021);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(leaderActivationIsLegal(engine)).toBe(true);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(leaderActivationIsLegal(engine)).toBe(false);
  });

  test("[When Attacking] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-002", attachedDon: 2 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.asSouth().attack("OP15-002", engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
