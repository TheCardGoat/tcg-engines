import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07MonkeyDDragon001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-001 Monkey.D.Dragon", () => {
  test("maps two physical DON!! from one donor and moves both to one Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07MonkeyDDragon001,
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderId = engine.leader("south");
    const recipientId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    engine.attachDon(leaderId, 2, "south");

    engine.activateEffect(leaderId, "activateMain", "south");

    const source = engine.pendingDecision("effectRedistributeDonSource", "south").steps[0];
    expect(source?.kind).toBe("selectEntity");
    if (source?.kind !== "selectEntity") throw new Error("Expected Dragon's DON!! choices.");
    expect(source).toMatchObject({ min: 0, max: 2 });
    expect(source.candidates.map((candidate) => candidate.ref.id)).toEqual([
      `attached-don:${leaderId}:0`,
      `attached-don:${leaderId}:1`,
    ]);
    engine.resolveDecision(
      "effectRedistributeDonSource",
      { selectedIds: source.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const target = engine.pendingDecision("effectRedistributeDonTarget", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Dragon's Character target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(recipientId);
    engine.resolveDecision("effectRedistributeDonTarget", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
