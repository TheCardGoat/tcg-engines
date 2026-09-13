/**
 * Topic suite: effect action order and partial impossibility (CR 1-3-2, 1-3-7).
 */
import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op01RoundTable027,
  op03Kaya044,
  op03OneTwoJango039,
  op04Sasaki048,
  op04Sugar024,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("Rules topics: effect resolution order (1-3-2, 1-3-7)", () => {
  test("1-3-7: actions resolve in printed order (Kaya draws before trash)", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: [eb01Doma005, eb01TonyTonyChopper006, op13Higuma013, op13Higuma013],
    });
    const south = engine.asSouth();

    south.play(op03Kaya044);

    // After the draw half, the just-drawn cards are legal trash selections.
    const drawnDomaId = south.findInZone("hand", eb01Doma005);
    const drawnChopperId = south.findInZone("hand", eb01TonyTonyChopper006);
    south.trashFromHand(eb01Doma005, eb01TonyTonyChopper006);

    const view = south.view();
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      south.findInZone("hand", op13Higuma013),
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([drawnDomaId, drawnChopperId]),
    );
  });

  test("1-3-2 + 1-3-7: impossible first action is skipped; later action still runs", () => {
    // One Two Jango: rest up to 1 cost≤1 (impossible vs Sugar), then +1000 power.
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op04Sugar024] },
    );
    const south = engine.asSouth();
    const mountainGodId = south.findOnField(eb01MountainGod018);

    south.play(op03OneTwoJango039);
    south.chooseTargets(eb01MountainGod018);

    const view = south.view();
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mountainGodId)?.power,
    ).toBe(8000);
    expect(view.players.north.characters.every((card) => !card || !card.rested)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("1-3-2-2: zero-count follow-up actions are not performed (Sasaki empty hand)", () => {
    // Sasaki returns hand then draws equal count; empty hand → return 0, draw 0.
    const engine = OnePieceTestEngine.create({
      hand: [op04Sasaki048],
      activeDon: 3,
      deck: 4,
    });
    const south = engine.asSouth();

    south.play(op04Sasaki048);

    const view = south.view();
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.status).toBe("active");
  });

  test("1-3-6-1 / 1-3-6-1-1: power may go negative without trashing the Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01RoundTable027], activeDon: 4 },
      { character: [eb01MountainGod018] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const mountainGodId = north.findOnField(eb01MountainGod018);

    south.play(op01RoundTable027);
    south.chooseTargets(eb01MountainGod018);

    const view = north.view();
    const mountainGod = view.players.north.characters.find(
      (card) => card?.instanceId === mountainGodId,
    );
    expect(mountainGod?.power).toBe(7000 - 10000);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(mountainGodId);
  });

  test("1-3-7: trash selection only offers cards present after the preceding draw", () => {
    // Extra Higuma stays in hand so the trash-2 step is a player choice (not auto-pay).
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: [eb01Doma005, eb01TonyTonyChopper006, op13Higuma013, op13Higuma013],
    });
    const south = engine.asSouth();

    south.play(op03Kaya044);
    const trashDecision = south.pendingDecision("effectTrashFromHandSelection");
    const step = trashDecision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected trash selection.");
    const handIds = new Set(
      south
        .view()
        .players.south.hand.map((card) => card.instanceId)
        .filter((id): id is string => Boolean(id)),
    );
    for (const candidate of step.candidates) {
      expect(handIds.has(candidate.ref.id)).toBe(true);
    }
    // Drawn cards plus the leftover Higuma are all live hand candidates.
    expect(step.candidates.length).toBeGreaterThanOrEqual(2);
    expect(handIds.has(south.findInZone("hand", eb01Doma005))).toBe(true);
    expect(handIds.has(south.findInZone("hand", eb01TonyTonyChopper006))).toBe(true);

    south.trashFromHand(eb01Doma005, eb01TonyTonyChopper006);
    expect(south.view().players.south.hand).toHaveLength(1);
  });
});
