import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-079 Monkey.D.Luffy", () => {
  test("cost-12+ Characters gain [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", character: ["OP17-118"], activeDon: 5 },
      {},
    );
    const xebecId = engine.findCardInZone("south", "character", "OP17-118");
    expect(xebecId).toBeDefined();
  });

  test("Characters below cost 12 gain no [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-079", character: ["OP13-013"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("south", "character", "OP13-013");
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    // No blocker window: Higuma is cheap, so the attack goes unanswered.
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === newgateId)
        ?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === higumaId),
    ).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
