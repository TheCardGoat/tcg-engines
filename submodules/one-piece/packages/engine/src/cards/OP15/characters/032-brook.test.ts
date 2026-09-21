import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Brook022 } from "../../../../../cards/src/cards/leaders/op15-022-brook.ts";
import { op15Brook032 } from "../../../../../cards/src/cards/characters/op15-032-brook.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-032 Brook", () => {
  test("[On Play] rests an opposing card, then self-trashes to set a Character active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Brook022,
        hand: [op15Brook032],
        character: [{ card: eb01Doma005, rested: true }],
        activeDon: 6,
      },
      { activeDon: 2 },
    );
    const brookId = () => engine.findCardInZone("south", "character", op15Brook032);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const northLeader = engine.leader("north");

    engine.playCard(op15Brook032);

    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Brook's rest choice.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(northLeader);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [northLeader] }, "south");
    expect(engine.getView("south").players.north.leader?.rested).toBe(true);

    const playedBrookId = brookId();
    engine.activateEffect(playedBrookId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's set-active target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      playedBrookId,
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === domaId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-032", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-032"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
