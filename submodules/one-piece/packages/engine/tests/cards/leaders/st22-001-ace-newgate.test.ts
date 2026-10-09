import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST22-001 Ace & Newgate", () => {
  test("reveals the sole eligible card, draws first, and returns that same card without a new choice", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["OP01-033", "ST02-002"],
      deck: ["ST02-006", "ST02-012", "ST02-002"],
    });
    const revealed = e.findCardInZone("south", "hand", "OP01-033");
    const drawn = e.findCardInZone("south", "deck", "ST02-006");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).not.toContain(revealed);
    expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(revealed);
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals Izo"))).toBe(true);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
  });

  test("chooses between inclusive Whitebeard types and preserves revealed identity across snapshot", () => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["OP01-033", "ST15-001", "ST02-002"],
      deck: ["ST02-006", "ST02-012", "ST02-002"],
    });
    const chosen = e.findCardInZone("south", "hand", "OP01-033");
    const ordinary = e.findCardInZone("south", "hand", "ST15-001");
    const wrong = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostRevealFromHand", "south");
    const step = p.steps[0];
    if (step?.kind !== "payCost") throw Error("reveal payment");
    expect(step.candidates.map((c) => c.ref.id).sort()).toEqual([chosen, ordinary].sort());
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.expectFailure({ type: "resolvePrompt", seat: "south", promptId: p.id, selectedIds: [wrong] });
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: [chosen] }, "south");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(chosen);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(ordinary);
  });

  test("declines the optional reveal without spending once per turn", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST22-001", hand: ["ST15-001"] });
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
  });

  test("cannot activate with only unrelated types in hand", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST22-001", hand: ["ST02-002"] });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
});
