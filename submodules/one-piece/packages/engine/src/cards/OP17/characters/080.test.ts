import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Usopp (OP17-080) cost=2 power=2000 counter=1000
describe("OP17-080 Usopp", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-080"], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-080");
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
      "OP17-080",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-080", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-080",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("search takes an eligible Elbaph card and trashes both unchosen revealed cards", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-080"], activeDon: 10, deck: ["OP17-089", "ST02-002", "ST02-006", "OP13-013"] },
      {},
    );
    e.asSouth().play("OP17-080");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected search");
    const id = step.candidates.find((c) => c.publicInfo?.cardId === "OP17-089")!.ref.id;
    e.resolveDecision("effectSearchSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP17-089"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-006",
    ]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("an opposing cost-twelve Character activates the power bonus", () => {
    const e = OnePieceTestEngine.create({ character: ["OP17-080"] }, { character: ["OP17-089"] });
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    const absent = OnePieceTestEngine.create({ character: ["OP17-080"] }, {});
    expect(absent.getView("south").players.south.characters[0]?.power).toBe(2000);
  });

  test("loses its live power bonus when the last qualifying Character is K.O.'d", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST06-001",
        character: ["OP17-080"],
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
});
