import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Sanji (OP17-082) cost=2 power=2000 counter=1000
describe("OP17-082 Sanji", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-082"], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-082");
    engine.acceptLeadingOptional("south");

    // Resolve any remaining prompts generically.
    for (let i = 0; i < 4; i++) {
      const remaining = engine.getView("south").prompts;
      if (remaining.length === 0) break;
      const d = (engine.getView("south").decisions ?? [])[0];
      if (!d) break;
      const intent = (d as { extensions?: { resolutionIntent?: any } }).extensions
        ?.resolutionIntent as any;
      if (intent === "effectTargetSelection" || intent === "effectPlaySelection") {
        const step = engine.pendingDecision(intent, "south").steps[0];
        if (step?.kind === "selectEntity" && step.candidates.length > 0) {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [step.candidates[0]!.ref.id] },
            "south",
          );
        } else {
          engine.resolveDecision(
            intent as Parameters<typeof engine.resolveDecision>[0],
            { selectedIds: [] },
            "south",
          );
        }
      } else {
        engine.resolveDecision(
          intent as Parameters<typeof engine.resolveDecision>[0],
          { optionId: "no" },
          "south",
        );
      }
    }

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-082",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-082", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-082",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("draws two and selects two hand cards to trash while the opposing cost-twelve Character powers the aura", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-082", "ST02-002"], activeDon: 10, deck: ["ST02-006", "OP13-013", "EB01-005"] },
      { character: ["OP17-089"] },
    );
    e.asSouth().play("OP17-082");
    const ids = [
      e.findCardInZone("south", "hand", "ST02-002"),
      e.findCardInZone("south", "hand", "OP13-013"),
    ];
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });

  test("loses its live power bonus when the last qualifying Character is K.O.'d", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST06-001",
        character: ["OP17-082"],
        activeDon: 2,
        deck: ["ST06-003", "ST06-003", "ST06-003"],
        life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
      },
      {
        leaderCardId: "ST06-001",
        character: [{ cardId: "OP17-089", rested: true }],
        hand: [],
        deck: ["ST06-003", "ST06-003", "ST06-003"],
        life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = e.findCardInZone("north", "character", "OP17-089");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().attack(e.leader("south"), target);
    expect(e.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(target);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("draws and trashes two even without a cost-twelve Character", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST06-001",
        life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
        hand: ["OP17-082", "ST06-002"],
        activeDon: 2,
        deck: ["ST06-003", "ST06-006", "ST06-003"],
      },
      {
        leaderCardId: "ST06-001",
        hand: [],
        deck: ["ST06-003", "ST06-003", "ST06-003"],
        life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
      },
    );
    e.asSouth().play("OP17-082");
    expect(e.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
      "ST06-002",
      "ST06-003",
      "ST06-006",
    ]);
    const selected = [
      e.findCardInZone("south", "hand", "ST06-002"),
      e.findCardInZone("south", "hand", "ST06-006"),
    ];
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: selected }, "south");
    const view = e.getView("south");
    expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["ST06-003"]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(selected);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.characters[0]?.power).toBe(2000);
    expect(view.prompts).toHaveLength(0);
  });
});
