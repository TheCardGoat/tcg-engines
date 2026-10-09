import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-007-killer", () => {
  test("own-turn DON return KOs only rested cost<=3, once per turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST10-003", character: ["ST10-007"], activeDon: 2 },
      {
        character: [
          { cardId: "ST02-012", rested: true },
          "ST02-012",
          { cardId: "ST02-006", rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = e.getView("south").players.north.characters[0]!.instanceId;
    if (!target) throw Error("Missing target");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
  test("declines the up-to KO after a real DON return", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST10-003", character: ["ST10-007"], activeDon: 1 },
      { character: [{ cardId: "ST02-012", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").players.north.trash).toHaveLength(0);
  });

  test("opponent Magellan returns DON on our turn; another return cannot repeat the effect", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["ST10-007", { cardId: "ST02-013", playedOnTurn: 0 }],
        activeDon: 4,
        hand: ["OP02-090"],
        deck: ["ST02-012", "ST02-006", "ST02-002"],
      },
      {
        character: [
          { cardId: "OP02-085", rested: true },
          { cardId: "ST02-012", rested: true },
          { cardId: "ST02-012", rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const observer = e.findCardInZone("south", "character", "ST10-007"),
      magellan = e.findCardInZone("north", "character", "OP02-085");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-013"), magellan, "south");
    expect(e.getView("south").players.south.activeDon).toBe(2);
    const target = e
      .getView("south")
      .players.north.characters.find((c) => c?.cardId === "ST02-012")?.instanceId;
    if (!target) throw Error("target");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
    e.playCard("OP02-090", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      e.getView("south").players.north.characters.filter((c) => c?.cardId === "ST02-012"),
    ).toHaveLength(1);
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === observer),
    ).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("does not KO on an opponent-turn DON return", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-085"], activeDon: 5, character: [{ cardId: "ST02-012", rested: true }] },
      { character: ["ST10-007"], activeDon: 1 },
    );
    const target = e.findCardInZone("south", "character", "ST02-012");
    e.playCard("OP02-085", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.north.activeDon).toBe(0);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("does not react when only the opponent's DON returns on our turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST10-007"] },
      { character: [{ cardId: "ST02-012", rested: true }], hand: ["OP02-089"], activeDon: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "OP02-089")] },
      "north",
    );
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.north.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
