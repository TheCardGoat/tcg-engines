import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-005 Killer", () => {
  test.each([false, true])(
    "plays from hand or Life and KOs only rested cost<=3: Trigger=%s",
    (life) => {
      const e = OnePieceTestEngine.create(
        {
          hand: life ? [] : ["ST02-005"],
          life: life ? ["ST02-005", "ST02-002"] : ["ST02-002"],
          activeDon: 3,
        },
        {
          character: [
            { cardId: "ST02-002", rested: true },
            { cardId: "ST02-006", rested: true },
            "ST02-002",
            { cardId: "EB01-018", playedOnTurn: 0 },
          ],
        },
        life ? { firstPlayer: "south", activeSeat: "north" } : {},
      );
      const target = e
        .getView("south")
        .players.north.characters.find((c) => c?.cardId === "ST02-002" && c.rested)!.instanceId;
      if (!target) throw new Error("Expected rested target identity.");
      if (life) {
        e.declareAttack(
          e.findCardInZone("north", "character", "EB01-018"),
          e.leader("south"),
          "north",
        );
        e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
      } else e.playCard("ST02-005", "south");
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("KO choice");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
      expect(
        e.getView("south").players.south.characters.some((c) => c?.cardId === "ST02-005"),
      ).toBe(true);
    },
  );
  test("may choose no KO with a legal rested Character available", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST02-005"], activeDon: 3 },
      { character: [{ cardId: "ST02-002", rested: true }] },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    e.playCard("ST02-005", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST02-005")).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
