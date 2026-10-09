import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op17Loki119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-119 Loki", () => {
  test("K.O.s opposing Characters up to a total cost of 4 without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17Loki119],
        activeDon: op17Loki119.cost,
        trash: [],
      },
      {
        character: [
          { card: eb01Doma005 }, // cost 1
          { cardId: "OP13-013" }, // cost 1 — both fit under the total cap
        ],
        activeDon: 3,
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const activeDonBefore = engine.getView("south").players.south.activeDon;

    engine.playCard(op17Loki119, "south");

    // Both together cost 2 — within the total of 4 — so both are selectable.
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. choice.");
    const candidates = ko.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(domaId);
    expect(candidates).toContain(higumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId, higumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(domaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(higumaId);
    // The effect K.O. costs no DON!! — only Loki's own printed cost was paid.
    expect(view.players.south.activeDon).toBe(activeDonBefore - 6);
    expect(view.prompts).toHaveLength(0);
  });

  test("rejects a combined cost of five unchanged, then K.O.s an exact total of four", () => {
    let engine = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", hand: [op17Loki119], activeDon: op17Loki119.cost },
      { leaderCardId: "ST01-001", character: ["ST01-004", "ST01-005", "ST01-003"] },
    );
    const sanji = engine.findCardInZone("north", "character", "ST01-004"),
      jinbe = engine.findCardInZone("north", "character", "ST01-005"),
      karoo = engine.findCardInZone("north", "character", "ST01-003");
    engine.asSouth().play(op17Loki119);
    const prompt = engine.pendingDecision("effectTargetSelection", "south");
    const step = prompt.steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected aggregate K.O. choice");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([sanji, jinbe, karoo]);
    const before = engine.getView("south");
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      selectedIds: [sanji, jinbe],
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    const rejected = engine.getView("south");
    expect(rejected.logs).toHaveLength(before.logs.length + 1);
    expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
    // Rejection adds only its diagnostic; every gameplay/view field is unchanged.
    expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(before);
    expect(engine.pendingDecision("effectTargetSelection", "south")).toEqual(prompt);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jinbe, karoo] }, "south");
    const view = engine.getView("south");
    expect(view.players.north.characters.filter(Boolean).map((card) => card?.instanceId)).toEqual([
      sanji,
    ]);
    expect(
      view.players.north.trash
        .map((card) => card.instanceId)
        .sort((a, b) => String(a).localeCompare(String(b))),
    ).toEqual([jinbe, karoo].sort((a, b) => a.localeCompare(b)));
    expect(view.players.south.characters.find((card) => card?.cardId === "OP17-119")?.cost).toBe(
      18,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("gains +3000 power during the opponent's turn and costs 12 more", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op17Loki119 }], activeDon: 6 },
      { activeDon: 3 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lokiPower = () =>
      engine.getView("south").players.south.characters.find((c) => c?.cardId === op17Loki119.id)
        ?.power;
    const lokiCost = () =>
      engine.getView("south").players.south.characters.find((c) => c?.cardId === op17Loki119.id)
        ?.cost;

    // On the opponent's turn: base 8000 + 3000, and a +12 cost.
    expect(lokiPower()).toBe(11000);
    expect(lokiCost()).toBe(18);

    engine.endTurn("north");
    expect(lokiPower()).toBe(8000);
    expect(lokiCost()).toBe(18);
  });
});
