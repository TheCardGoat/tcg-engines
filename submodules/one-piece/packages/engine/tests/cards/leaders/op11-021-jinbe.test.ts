import { describe, expect, test } from "vite-plus/test";
import { op11Jinbe021, op11Jinbe031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-021 Jinbe", () => {
  test("reactivates an included Merfolk Character and one DON!! at six cards or less", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Jinbe021,
      character: [{ card: op11Jinbe031, rested: true, playedOnTurn: 0 }],
      restedDon: 2,
    });
    const jinbeId = engine.findCardInZone("south", "character", op11Jinbe031);

    engine.endTurn("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jinbeId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("the two ready choices are independent and seven cards disables both", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP11-021",
      character: [{ cardId: "OP11-031", rested: true }],
      restedDon: 2,
    });
    const c = e.findCardInZone("south", "character", "OP11-031");
    e.asSouth().endTurn();
    e.asSouth().chooseTargets();
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(
      e.getView("south").players.south.characters.find((x) => x?.instanceId === c)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    const blocked = OnePieceTestEngine.create({
      leaderCardId: "OP11-021",
      hand: Array(7).fill("EB01-005"),
      character: [{ cardId: "OP11-031", rested: true }],
      restedDon: 2,
    });
    blocked.asSouth().endTurn();
    expect(blocked.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(blocked.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(blocked.getView("south").prompts).toHaveLength(0);
  });
});
