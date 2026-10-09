import { describe, expect, test } from "vite-plus/test";
import { op07CaptainJohn082, op17Kyo045, op17Shiki048, op17RocksDXebec118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-118 Rocks.D.Xebec", () => {
  test("draws 1 and replays {Rocks Pirates} Characters within a total cost of 9", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17RocksDXebec118, op17Kyo045, op17Shiki048, op07CaptainJohn082],
        deck: ["OP16-096", "OP16-095"],
        activeDon: op17RocksDXebec118.cost,
      },
      {},
    );
    const kyoId = engine.findCardInZone("south", "hand", op17Kyo045);

    engine.playCard(op17RocksDXebec118, "south");
    // Draw 1 happened as part of the On Play.
    expect(engine.getView("south").players.south.hand.length).toBeGreaterThanOrEqual(2);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(kyoId);
    expect(candidates).not.toContain(engine.findCardInZone("south", "hand", op07CaptainJohn082));
    expect(candidates).toContain(engine.findCardInZone("south", "hand", op17Shiki048));
    expect(play.constraints).toContainEqual(
      expect.objectContaining({ id: "totalConstraint", operator: "lte", value: 9 }),
    );
    // Kyo (2) and Shiki (7) both qualify. Choose only Kyo.
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kyoId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(kyoId);
    expect(view.hand.map((card) => card.cardId)).toContain(op17Shiki048.id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("a pair within the total cost replays both Rocks cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17RocksDXebec118, op17Kyo045, "OP17-052"],
        deck: ["OP16-096", "OP16-095"],
        activeDon: op17RocksDXebec118.cost,
      },
      {},
    );
    const kyoId = engine.findCardInZone("south", "hand", op17Kyo045);
    const marlonId = engine.findCardInZone("south", "hand", "OP17-052");

    engine.playCard(op17RocksDXebec118, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    // Kyo (2) + Don Marlon (3) total 5 — under the cap.
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kyoId, marlonId] }, "south");
    // Resolve Kyo before Don Marlon.
    const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw new Error("Expected ready-effect order");
    const selected = order.options.find((option) => option.targetId === kyoId);
    if (!selected) throw new Error("Expected the intended ready effect");
    engine.resolveDecision("readyEffectOrder", { optionId: selected.id }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(kyoId);
    expect(view.characters.map((card) => card?.instanceId)).toContain(marlonId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

describe.each(["south", "north"] as const)("Rocks aggregate selection as %s", (seat) => {
  function setup() {
    const player = {
      leaderCardId: "OP01-060",
      hand: ["OP17-118", "OP17-048", "OP17-046", "OP17-045"],
      deck: ["OP17-050", "OP17-050", "OP17-050", "OP17-050"],
      activeDon: 10,
    };
    let engine = OnePieceTestEngine.create(
      seat === "south" ? player : {},
      seat === "north" ? player : {},
      { activeSeat: seat },
    );
    engine.playCard(op17RocksDXebec118, seat);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    return engine;
  }

  test("rejects total eleven without consuming the choice, then accepts an exact-nine retry", () => {
    let engine = setup();
    const shiki = engine.findCardInZone(seat, "hand", "OP17-048");
    const gloriosa = engine.findCardInZone(seat, "hand", "OP17-046");
    const kyo = engine.findCardInZone(seat, "hand", "OP17-045");
    const prompt = engine.getView(seat).prompts[0];
    if (!prompt) throw new Error("Expected Rocks play choice");
    const before = engine.getView(seat);
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat,
      promptId: prompt.id,
      selectedIds: [shiki, gloriosa],
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    const rejected = engine.getView(seat);
    expect(rejected.logs).toHaveLength(before.logs.length + 1);
    expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
    expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(before);
    expect(rejected.prompts[0]).toEqual(prompt);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectPlaySelection", { selectedIds: [shiki, kyo] }, seat);
    const view = engine.getView(seat);
    expect(view.players[seat].characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([shiki, kyo]),
    );
    expect(view.players[seat].hand.map((card) => card.instanceId)).toContain(gloriosa);
    expect(view.prompts).toHaveLength(0);
  });

  test("the printed up-to clause permits declining after restore", () => {
    const engine = setup();
    const before = engine.getView(seat).players[seat];
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, seat);
    expect(engine.getView(seat).players[seat]).toEqual(before);
    expect(engine.getView(seat).prompts).toHaveLength(0);
  });
  test("rejects duplicate names under the cost cap atomically and accepts a different-name retry", () => {
    const player = {
      leaderCardId: "OP01-060",
      hand: ["OP17-118", "OP17-045", "OP17-045", "OP17-048"],
      deck: ["OP17-050", "OP17-050", "OP17-050"],
      activeDon: 10,
    };
    let e = OnePieceTestEngine.create(
      seat === "south" ? player : {},
      seat === "north" ? player : {},
      { activeSeat: seat },
    );
    e.playCard("OP17-118", seat);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    const duplicates = e
      .getView(seat)
      .players[seat].hand.flatMap((c) =>
        c.cardId === "OP17-045" && c.instanceId ? [c.instanceId] : [],
      );
    expect(duplicates).toHaveLength(2);
    const shiki = e.findCardInZone(seat, "hand", "OP17-048");
    const before = e.getView(seat);
    const prompt = before.prompts[0];
    if (!prompt) throw new Error("Expected Rocks play choice");
    const failed = e.expectFailure({
      type: "resolvePrompt",
      seat,
      promptId: prompt.id,
      selectedIds: duplicates,
    });
    e = OnePieceTestEngine.fromState(failed.state);
    const rejected = e.getView(seat);
    expect(rejected.logs).toHaveLength(before.logs.length + 1);
    expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
    expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(before);
    expect(rejected.prompts[0]).toEqual(prompt);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectPlaySelection", { selectedIds: [duplicates[0]!, shiki] }, seat);
    expect(e.getView(seat).players[seat].characters.map((c) => c?.instanceId)).toEqual(
      expect.arrayContaining([duplicates[0], shiki]),
    );
    expect(e.getView(seat).players[seat].hand.map((c) => c.instanceId)).toContain(duplicates[1]);
    expect(e.getView(seat).prompts).toHaveLength(0);
  });
});
