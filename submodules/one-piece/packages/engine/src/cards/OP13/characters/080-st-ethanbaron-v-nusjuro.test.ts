import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04GumGumRedRoc056 } from "@tcg/op-cards";
import { op13StEthanbaronVNusjuro080 } from "../../../../../cards/src/cards/OP13/characters/080-st-ethanbaron-v-nusjuro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-080 St. Ethanbaron V. Nusjuro", () => {
  test("with seven cards in trash gains Rush and attacks on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13StEthanbaronVNusjuro080],
        trash: Array.from({ length: 7 }, () => eb01Doma005),
        activeDon: op13StEthanbaronVNusjuro080.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op13StEthanbaronVNusjuro080, "south");
    const nusjuroId = engine.findCardInZone("south", "character", op13StEthanbaronVNusjuro080);
    engine.declareAttack(nusjuroId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === nusjuroId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven trash is excluded from opponent-effect removal, but at six it can be removed", () => {
    const protectedEngine = OnePieceTestEngine.create(
      {
        character: [op13StEthanbaronVNusjuro080, eb01Doma005],
        trash: Array.from({ length: 7 }, () => eb01Doma005),
      },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = protectedEngine.findCardInZone(
      "south",
      "character",
      op13StEthanbaronVNusjuro080,
    );
    const removableId = protectedEngine.findCardInZone("south", "character", eb01Doma005);

    protectedEngine.playCard(op04GumGumRedRoc056, "north");
    const target = protectedEngine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Red Roc's removal target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(removableId);
    protectedEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [removableId] },
      "north",
    );
    const protectedView = protectedEngine.getView("south");
    expect(protectedView.players.south.characters.map((card) => card?.instanceId)).toContain(
      protectedId,
    );
    expect(protectedEngine.findCardInZone("south", "deck", eb01Doma005)).toBe(removableId);
    expect(protectedView.prompts).toHaveLength(0);

    const vulnerableEngine = OnePieceTestEngine.create(
      {
        character: [op13StEthanbaronVNusjuro080],
        trash: Array.from({ length: 6 }, () => eb01Doma005),
      },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vulnerableId = vulnerableEngine.findCardInZone(
      "south",
      "character",
      op13StEthanbaronVNusjuro080,
    );

    vulnerableEngine.playCard(op04GumGumRedRoc056, "north");
    vulnerableEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [vulnerableId] },
      "north",
    );

    const vulnerableView = vulnerableEngine.getView("south");
    expect(vulnerableView.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      vulnerableId,
    );
    expect(vulnerableEngine.findCardInZone("south", "deck", op13StEthanbaronVNusjuro080)).toBe(
      vulnerableId,
    );
    expect(vulnerableView.prompts).toHaveLength(0);
  });

  test("with ten trash reduces the selected opposing Character by 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13StEthanbaronVNusjuro080, playedOnTurn: 0 }],
        trash: Array.from({ length: 10 }, () => eb01Doma005),
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const nusjuroId = engine.findCardInZone("south", "character", op13StEthanbaronVNusjuro080);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(nusjuroId, engine.leader("north"), "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Nusjuro's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opponentId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe(eb01Doma005.power);
  });

  test("may choose no power target at ten trash and offers no effect at nine", () => {
    const declined = OnePieceTestEngine.create(
      {
        character: [{ card: op13StEthanbaronVNusjuro080, playedOnTurn: 0 }],
        trash: Array.from({ length: 10 }, () => eb01Doma005),
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedSourceId = declined.findCardInZone(
      "south",
      "character",
      op13StEthanbaronVNusjuro080,
    );
    const declinedTargetId = declined.findCardInZone("north", "character", eb01Doma005);
    declined.declareAttack(declinedSourceId, declined.leader("north"), "south");
    declined.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      declined
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === declinedTargetId)?.power,
    ).toBe(eb01Doma005.power);
    expect(declined.getView("south").prompts).toHaveLength(0);

    const belowThreshold = OnePieceTestEngine.create(
      {
        character: [{ card: op13StEthanbaronVNusjuro080, playedOnTurn: 0 }],
        trash: Array.from({ length: 9 }, () => eb01Doma005),
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const belowSourceId = belowThreshold.findCardInZone(
      "south",
      "character",
      op13StEthanbaronVNusjuro080,
    );
    const belowTargetId = belowThreshold.findCardInZone("north", "character", eb01Doma005);
    belowThreshold.declareAttack(belowSourceId, belowThreshold.leader("north"), "south");
    expect(
      belowThreshold
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === belowTargetId)?.power,
    ).toBe(eb01Doma005.power);
    expect(belowThreshold.getView("south").prompts).toHaveLength(0);
  });
});
