import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-016 Lion's Threat Imperial Earth Bind", () => {
  test("pays DON minus2 to KO only cost<=5", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST05-016"], activeDon: 4, restedDon: 1 },
      { character: ["ST02-010", "ST02-013"] },
    );
    const id = e.findCardInZone("north", "character", "ST02-010");
    const donBefore = e.getView("south").players.south.donDeckCount;
    e.playCard("ST05-016", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KOchoice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      donDeckCount: donBefore + 2,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declining the optional DON return leaves both opposing Characters and DON unchanged after Event payment", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST05-016"], activeDon: 4, restedDon: 1 },
      { character: ["ST02-010", "ST02-013"] },
    );
    const fieldBefore = e.getView("south").players.north.characters;
    const donBefore = e.getView("south").players.south.donDeckCount;
    e.playCard("ST05-016", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 4,
      donDeckCount: donBefore,
      handCount: 0,
    });
    expect(e.getView("south").players.north.characters).toEqual(fieldBefore);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger adds one active DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST05-016"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const before = e.getView("north").players.north.donDeckCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "north");
    expect(e.getView("north").players.north).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: before - 1,
    });
  });
});
