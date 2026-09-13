import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07MonkeyDLuffy073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function payReturnDon(engine: OnePieceTestEngine, sourceId: string) {
  engine.activateEffect(sourceId, "activateMain", "south");
  // DON!! −3 is optional ("You may return…"). pendingDecision auto-accepts that
  // confirm; the engine may then auto-pay an exact return or still ask which DON!!.
  try {
    engine.acceptLeadingOptional("south");
    const step = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (step?.kind === "payCost") {
      const selectedIds = step.candidates.slice(0, 3).map((candidate) => candidate.ref.id);
      engine.resolveDecision("effectCostReturnDon", { selectedIds }, "south");
    }
  } catch {
    // Optional accepted and cost auto-resolved with no remaining prompt.
  }
}

describe("OP07-073 Monkey.D.Luffy", () => {
  test("returns three DON!! to set itself active with three opposing Characters, only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy073, rested: true }],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01Fourtricks025, eb01Doma005] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy073);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payReturnDon(engine, luffyId);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 3);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: luffyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("still pays DON!! -3 when the post-colon Character-count condition is false", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy073, rested: true }],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy073);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payReturnDon(engine, luffyId);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      true,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 3);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional Activate: Main so DON!! return and active set do not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy073, rested: true }],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01Fourtricks025, eb01Doma005] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy073);

    engine.activateEffect(luffyId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      true,
    );
    expect(view.players.south.activeDon + view.players.south.restedDon).toBe(donPoolBefore);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
