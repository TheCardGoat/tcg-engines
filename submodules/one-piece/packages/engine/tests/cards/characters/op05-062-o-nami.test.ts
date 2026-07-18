import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Crocodile060, op05ONami062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-062 O-Nami", () => {
  test("is a Blocker with exactly 10 total DON!! cards on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05ONami062], activeDon: 5, restedDon: 5 },
      { character: [{ card: eb01MountainGod018, attachedDon: 1, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const oNamiId = engine.findCardInZone("south", "character", op05ONami062);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected O-Nami's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(oNamiId);
  });

  test("loses Blocker dynamically after DON!! is returned below 10", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op05ONami062],
        hand: [op04Crocodile060],
        deck: [eb01Doma005],
        activeDon: 10,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    engine.playCard(op04Crocodile060, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected DON!! return payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    engine.endTurn("south");
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );

    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "battleBlocker",
        ),
    ).toBe(false);
    expect(op05ONami062.name).toBe("O-Nami");
  });
});
