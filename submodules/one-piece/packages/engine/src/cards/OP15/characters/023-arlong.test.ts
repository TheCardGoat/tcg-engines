import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Arlong023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP15-023 Arlong", () => {
  test("[On K.O.] freezes up to 2 of the opponent's rested cards through their next Refresh Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op15Arlong023, rested: true },
          { card: eb01Doma005, rested: true },
        ],
        activeDon: 2,
      },
      {
        character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }],
        activeDon: 2,
        restedDon: 2,
      },
      OPPONENTS_TURN,
    );
    const arlongId = engine.findCardInZone("south", "character", op15Arlong023);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, arlongId, "north");
    // 8000 attacker beats 5000 Arlong; Arlong's [On K.O.] offers the freeze.
    const freeze = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (freeze?.kind !== "selectEntity") throw new Error("Expected the freeze targets.");
    const candidates = freeze.candidates.map((candidate) => candidate.ref.id);
    expect(candidates.some((id) => id.startsWith("rested-don:"))).toBe(true);
    expect(candidates.length).toBeGreaterThanOrEqual(2);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: candidates.slice(0, 2) },
      "south",
    );

    // The frozen cards skip north's next Refresh Phase re-activation.
    engine.endTurn("north");
    engine.endTurn("south");
    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(1);
    expect(north.characters.find((c) => c?.cardId === "OP16-096")?.rested).toBe(true);
  });

  test("[Activate: Main] pays with an opposing rested DON!!, then moves a cost-area DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Arlong023], activeDon: 2 },
      { character: [{ card: eb01Doma005 }], activeDon: 2, restedDon: 2 },
      {},
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const leaderId = engine.leader("north");

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Arlong023),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected the clog cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId, domaId]);
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [domaId] }, "south");
    expect(engine.getView("south").players.north.restedDon).toBe(1);

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the clog target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    // The cost-area give draws from the rested pool first.
    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(0);
    expect(north.activeDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] declines change nothing and do not consume the once-per-turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Arlong023], activeDon: 2 },
      { character: [{ card: eb01Doma005 }], activeDon: 2, restedDon: 2 },
      {},
    );
    const arlongId = engine.findCardInZone("south", "character", op15Arlong023);

    engine.activateEffect(arlongId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    let north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(2);
    expect(north.activeDon).toBe(2);

    // A declined activation is not a use: the window must reopen.
    engine.activateEffect(arlongId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected the clog cost.");
    engine.resolveDecision(
      "effectCostGiveDon",
      { selectedIds: [payment.candidates[0]!.ref.id] },
      "south",
    );
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(1);
    expect(north.activeDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);

    // The accepted activation consumed the once-per-turn.
    expect(() => engine.activateEffect(arlongId, "activateMain", "south")).toThrow();
  });
});
