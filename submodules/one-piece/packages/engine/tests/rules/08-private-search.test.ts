import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("private and revealed deck searches", () => {
  test("keeps a private selection and remainder order private after JSON continuation", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: "OP12-041",
      hand: ["OP12-079"],
      deck: ["EB01-018", "ST02-012", "ST02-002"],
      activeDon: 1,
    });
    const selected = engine.findCardInZone("south", "deck", "EB01-018");
    const bepo = engine.findCardInZone("south", "deck", "ST02-012");
    const vito = engine.findCardInZone("south", "deck", "ST02-002");
    engine.playCard("OP12-079", "south");
    expect(JSON.stringify(engine.getView("north"))).not.toContain("Mountain God");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
    expect(JSON.stringify(engine.getView("north"))).not.toContain("Mountain God");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: [vito, bepo] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selected,
    );
    expect(engine.getState().players.south.deck).toEqual([vito, bepo]);
    expect(JSON.stringify(engine.getView("north"))).not.toContain("Mountain God");
    expect(
      engine.getView("south").logs.some((entry) => entry.message.includes("Mountain God")),
    ).toBe(true);
  });

  test("still publicly reveals the selected card when the search requires revelation", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP03-089"],
      deck: ["OP03-079", "ST02-012", "ST02-002", "ST02-002"],
      activeDon: 2,
    });
    const vergo = engine.findCardInZone("south", "deck", "OP03-079");
    engine.playCard("OP03-089", "south");
    expect(JSON.stringify(engine.getView("north"))).not.toContain("Vergo");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [vergo] }, "south");
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes("reveals Vergo")),
    ).toBe(true);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      vergo,
    );
  });
});
