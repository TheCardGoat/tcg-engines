import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09CatarinaDevon084,
  op09MarshallDTeach081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function activateDevonChoice(engine: OnePieceTestEngine, devonId: string, optionId: string) {
  engine.activateEffect(devonId, "activateMain", "south");
  const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
  expect(choice?.kind).toBe("chooseOption");
  if (choice?.kind !== "chooseOption") throw new Error("Expected Devon's keyword choice.");
  expect(choice.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
  engine.resolveDecision("effectActionChoice", { optionId }, "south");
}

describe("OP09-084 Catarina Devon", () => {
  test("chooses Double Attack and cannot activate a second time that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09CatarinaDevon084, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const devonId = engine.findCardInZone("south", "character", op09CatarinaDevon084);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    activateDevonChoice(engine, devonId, "0");
    const second = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: devonId,
      trigger: "activateMain",
    });
    expect(second.reason).toBe("This effect has already been used this turn.");

    engine.declareAttack(devonId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("chooses Banish so damaged Life is trashed instead of added to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09CatarinaDevon084, playedOnTurn: 0 }],
      },
      {
        life: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const devonId = engine.findCardInZone("south", "character", op09CatarinaDevon084);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);

    activateDevonChoice(engine, devonId, "1");
    engine.declareAttack(devonId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(lifeId);
  });

  test("chooses Blocker through the opponent's next turn and loses it afterward", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [op09CatarinaDevon084],
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const devonId = engine.findCardInZone("south", "character", op09CatarinaDevon084);
    const firstAttackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    activateDevonChoice(engine, devonId, "2");
    engine.endTurn("south");
    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Devon's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(devonId);
    engine.resolveDecision("battleBlocker", { selectedIds: [devonId] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === devonId)
        ?.rested,
    ).toBe(true);

    engine.endTurn("north");
    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });

  test("cannot activate without a Blackbeard Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({ character: [op09CatarinaDevon084] });
    const devonId = engine.findCardInZone("south", "character", op09CatarinaDevon084);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: devonId,
      trigger: "activateMain",
    });
    expect(failure.reason).toBe("The activation conditions are not met.");
  });
});
