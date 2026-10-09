import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-006-monkey-d-luffy", () => {
  test("Rush attacks immediately and opponent Blocker KO cancels battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-006"], activeDon: 10 },
      { character: ["ST01-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-006", "south");
    const luffy = e.findCardInZone("south", "character", "ST10-006"),
      blocker = e.findCardInZone("north", "character", "ST01-006");
    e.declareAttack(luffy, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [blocker] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(blocker);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("can KO another <=8000 Character when an opponent blocks, and only once per turn", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          "ST10-006",
          { cardId: "ST02-006", playedOnTurn: 0 },
          { cardId: "ST02-006", playedOnTurn: 0 },
        ],
      },
      { character: ["ST01-006", "ST01-006", "ST02-006", "OP01-120"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackers = e
        .getView("south")
        .players.south.characters.filter((c) => c?.cardId === "ST02-006")
        .map((c) => c!.instanceId),
      blockers = e
        .getView("south")
        .players.north.characters.filter((c) => c?.cardId === "ST01-006")
        .map((c) => c!.instanceId);
    const target = e.findCardInZone("north", "character", "ST02-006");
    e.declareAttack(attackers[0]!, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blockers[0]!] }, "north");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("targets");
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("north", "character", "OP01-120"),
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.declareAttack(attackers[1]!, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blockers[1]!] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([target, ...blockers]),
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines the up-to KO when an opponent blocks", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST10-006", playedOnTurn: 0 }] },
      { character: ["ST01-006", "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST10-006"), e.leader("north"), "south");
    e.resolveDecision(
      "battleBlocker",
      { selectedIds: [e.findCardInZone("north", "character", "ST01-006")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.north.characters.some((c) => c?.cardId === "ST02-006")).toBe(
      true,
    );
    expect(e.getView("south").players.north.trash).toHaveLength(1);
  });

  test("a friendly Blocker activation does not trigger the opponent-only KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }, "ST02-012"] },
      { character: ["ST10-006", "ST01-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blocker = e.findCardInZone("north", "character", "ST01-006");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(blocker);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
