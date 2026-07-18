import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03Gaimon043,
  op03UsoppSRubberBandOfDoom054,
  op13Vista046,
} from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const trashThenDraw = {
  action: "trashFromDeck" as const,
  player: "self" as const,
  amount: 2,
  upTo: true,
  thenActions: [{ action: "draw" as const, player: "self" as const, amount: 1 }],
};

describe("OP03-043 Gaimon", () => {
  test("when another Character deals Life damage, offers the optional three-card trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Gaimon043, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: Array.from({ length: 4 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const optional = engine.pendingDecision("effectOptional", "south").steps[0];
    expect(optional?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 3);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.players.south.characters.some((card) => card?.cardId === op03Gaimon043.id)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("a Double Attack fulfills its damage trigger exactly once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Gaimon043, { card: op13Vista046, playedOnTurn: 0 }],
        deck: Array.from({ length: 7 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Vista046);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const opposingLifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(opposingLifeBefore - 2);
    expect(engine.pendingDecision("effectOptional", "south").steps).toHaveLength(1);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 3);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.players.south.characters.some((card) => card?.cardId === op03Gaimon043.id)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("an earlier Life Trigger resumes Double Attack before Gaimon triggers once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Gaimon043, { card: op13Vista046, playedOnTurn: 0 }],
        deck: Array.from({ length: 7 }, () => eb01Doma005),
      },
      { life: [op03UsoppSRubberBandOfDoom054, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Vista046);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(1);
    expect(engine.pendingDecision("lifeTrigger", "north").steps).toHaveLength(1);
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow(
      "Could not find a pending effectOptional prompt for south.",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");

    expect(engine.getView("south").players.north.lifeCount).toBe(0);
    expect(engine.pendingDecision("effectOptional", "south").steps).toHaveLength(1);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 3);
    expect(view.players.south.characters.some((card) => card?.cardId === op03Gaimon043.id)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing deck cards or Gaimon", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Gaimon043, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: Array.from({ length: 4 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const gaimonId = engine.findCardInZone("south", "character", op03Gaimon043);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.characters.some((card) => card?.instanceId === gaimonId)).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trash Gaimon when fewer than three deck cards can be trashed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Gaimon043, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const gaimonId = engine.findCardInZone("south", "character", op03Gaimon043);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.characters.some((card) => card?.instanceId === gaimonId)).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});

describe("trashFromDeck continuations", () => {
  test("runs thenActions after choosing a positive up-to count", () => {
    const engine = OnePieceTestEngine.create({
      deck: Array.from({ length: 5 }, () => eb01Doma005),
    });
    const viewBefore = engine.getView("south");

    expect(
      processEffectAction(engine.getState(), "south", engine.leader("south"), trashThenDraw),
    ).toBe(false);
    engine.resolveDecision("effectTrashFromDeckCount", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(viewBefore.players.south.deckCount - 3);
    expect(view.players.south.handCount).toBe(viewBefore.players.south.handCount + 1);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not run thenActions after choosing zero", () => {
    const engine = OnePieceTestEngine.create({
      deck: Array.from({ length: 5 }, () => eb01Doma005),
    });
    const viewBefore = engine.getView("south");

    expect(
      processEffectAction(engine.getState(), "south", engine.leader("south"), trashThenDraw),
    ).toBe(false);
    engine.resolveDecision("effectTrashFromDeckCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(viewBefore.players.south.deckCount);
    expect(view.players.south.handCount).toBe(viewBefore.players.south.handCount);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
