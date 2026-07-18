import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01BaoHuang105, op01Hajrudin018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-105 Bao Huang", () => {
  test("lets its controller privately choose two opposing hand cards that are then revealed publicly", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01BaoHuang105],
        activeDon: op01BaoHuang105.cost,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025, op01Hajrudin018],
      },
    );
    const firstId = engine.findCardInZone("north", "hand", eb01Doma005);
    const secondId = engine.findCardInZone("north", "hand", eb01Fourtricks025);

    engine.playCard(op01BaoHuang105, "south");

    const reveal = engine.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    expect(reveal?.kind).toBe("selectEntity");
    if (reveal?.kind !== "selectEntity") {
      throw new Error("Expected Bao Huang's opposing-hand reveal choice.");
    }
    expect(reveal).toMatchObject({ min: 2, max: 2 });
    expect(reveal.candidates.map((candidate) => candidate.label)).toEqual([
      "Card 1",
      "Card 2",
      "Card 3",
    ]);
    expect(reveal.candidates.every((candidate) => candidate.ref.kind === "option")).toBe(true);
    expect(reveal.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(true);
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstId);
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(secondId);
    const prompt = engine
      .getState()
      .promptQueue.find(
        (candidate) =>
          candidate.status === "pending" &&
          candidate.resolutionContext?.intent === "effectRevealFromHandSelection",
      );
    if (prompt?.resolutionContext?.intent !== "effectRevealFromHandSelection") {
      throw new Error("Expected Bao Huang's concealed reveal prompt.");
    }
    const opaqueIds = prompt.resolutionContext.opaqueCandidateIds ?? {};
    const selectedTokens = [firstId, secondId].map((instanceId) => {
      const token = Object.entries(opaqueIds).find(
        ([, candidateId]) => candidateId === instanceId,
      )?.[0];
      if (!token) throw new Error("Expected an opaque token for Bao Huang's selected card.");
      return token;
    });
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: selectedTokens },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.logs.some(
        (entry) =>
          entry.message.includes(eb01Doma005.name) &&
          entry.message.includes(eb01Fourtricks025.name),
      ),
    ).toBe(true);
    expect(view.logs.some((entry) => entry.message.includes(op01Hajrudin018.name))).toBe(false);
    const spectator = engine.getView("spectator");
    expect(spectator.players.north.hand.every((card) => card.instanceId === null)).toBe(true);
    expect(
      spectator.logs.some(
        (entry) =>
          entry.message.includes(eb01Doma005.name) &&
          entry.message.includes(eb01Fourtricks025.name),
      ),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("reveals nothing when the opponent has fewer than the exact two required cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01BaoHuang105],
        activeDon: op01BaoHuang105.cost,
      },
      {
        hand: [eb01Doma005],
      },
    );

    engine.playCard(op01BaoHuang105, "south");

    const southView = engine.getView("south");
    const spectatorView = engine.getView("spectator");
    expect(southView.decisions.some((decision) => decision.title.includes("Bao Huang"))).toBe(
      false,
    );
    expect(southView.logs.some((entry) => entry.message.includes(eb01Doma005.name))).toBe(false);
    expect(spectatorView.logs.some((entry) => entry.message.includes(eb01Doma005.name))).toBe(
      false,
    );
    expect(spectatorView.players.north.hand).toEqual([
      expect.objectContaining({ cardId: null, instanceId: null }),
    ]);
    expect(southView.prompts).toHaveLength(0);
  });
});
