import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Igaram002,
  op04Karoo004,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-002 Igaram", () => {
  test("pays both active-card costs before searching for an included Alabasta type", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Igaram002],
      deck: [
        op04Karoo004,
        op04Igaram002,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
    });
    const igaramId = engine.findCardInZone("south", "character", op04Igaram002);
    const compoundAlabastaId = engine.findCardInZone("south", "deck", op04Karoo004);
    const exactAlabastaId = engine.findCardInZone("south", "deck", op04Igaram002);
    const deckBefore = [...engine.getState().players.south.deck];
    const untouchedId = deckBefore[5]!;

    engine.activateEffect(igaramId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === igaramId)?.rested,
    ).toBe(true);

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Igaram's top-five search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === exactAlabastaId)?.legal).toBe(
      true,
    );
    expect(
      search.candidates.find((candidate) => candidate.ref.id === compoundAlabastaId)?.legal,
    ).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundAlabastaId] }, "south");

    const remainderOrder = deckBefore
      .slice(0, 5)
      .filter((id) => id !== compoundAlabastaId)
      .reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const resolved = engine.getView("south");
    expect(resolved.players.south.hand.map((card) => card.instanceId)).toContain(
      compoundAlabastaId,
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...remainderOrder]);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal no card and orders all five looked cards on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Igaram002],
      deck: [op04Karoo004, op04Igaram002, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    });
    const igaramId = engine.findCardInZone("south", "character", op04Igaram002);
    const lookedIds = [...engine.getState().players.south.deck];

    engine.activateEffect(igaramId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const bottomOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself or reducing the active Leader", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Igaram002],
      deck: [op04Karoo004, op04Igaram002, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    });
    const igaramId = engine.findCardInZone("south", "character", op04Igaram002);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.activateEffect(igaramId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === igaramId)?.rested,
    ).toBe(false);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer or resolve its effect after its Leader becomes rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Igaram002] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const igaramId = engine.findCardInZone("south", "character", op04Igaram002);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: igaramId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.leader.power).toBe(5000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === igaramId)?.rested,
    ).toBe(false);
  });
});
