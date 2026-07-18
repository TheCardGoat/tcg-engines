import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb02RoronoaZoroPrb02006006 } from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-006 Roronoa Zoro", () => {
  test("declares the opponent-turn rest replacement against an opponent Character effect", () => {
    const replacement = prb02RoronoaZoroPrb02006006.effects?.replacementEffects?.[0];
    expect(replacement).toMatchObject({
      replacedEvent: "rested",
      source: "opponentCharacterEffect",
      eventFilter: { targetSelf: true },
      conditions: [{ condition: "turn", value: "opponent" }],
    });
    expect(replacement?.replacementAction).toMatchObject({
      action: "rest",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: 1 },
        filters: [{ filter: "excludeSelf" }],
      },
    });
  });

  test("can block an attack on its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02RoronoaZoroPrb02006006] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", prb02RoronoaZoroPrb02006006);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [zoroId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(zoroId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may rest another Character instead of being rested by an opponent Character effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02RoronoaZoroPrb02006006, eb01MountainGod018] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", prb02RoronoaZoroPrb02006006);
    const allyId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sourceId = engine.findCardInZone("north", "character", eb01MountainGod018);

    processEffectAction(
      engine.getState(),
      "north",
      sourceId,
      {
        action: "rest",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1 },
        },
      },
      [zoroId],
    );
    engine.resolveDecision("effectRestReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zoroId)?.rested).toBe(
      false,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      true,
    );
  });
});
