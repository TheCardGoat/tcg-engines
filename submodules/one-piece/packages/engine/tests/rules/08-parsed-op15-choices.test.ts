import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/index.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function parsed(id: string, run: () => void) {
  const card = getCard(id),
    original = card.effects;
  const effects = buildCardEffects(card.effect ?? "");
  if (!effects) throw new Error(`Missing parsed effects for ${id}`);
  card.effects = effects;
  try {
    run();
  } finally {
    card.effects = original;
  }
}
test("generated Purinpurin saves a legal unequal target choice without K.O.", () =>
  parsed("OP15-031", () => {
    let e = OnePieceTestEngine.create(
      { hand: ["OP15-031"], activeDon: 2 },
      { character: [{ cardId: "EB01-005", rested: true, attachedDon: 2 }] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("OP15-031");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected target choice");
    expect(step.candidates.map((c) => c.ref.id)).toContain(target);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.characters[0]?.instanceId).toBe(target);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
  }));
test("generated Kuro permits an own target without suppressing its own Refresh", () =>
  parsed("OP15-025", () => {
    let e = OnePieceTestEngine.create(
      {
        hand: ["OP15-025"],
        activeDon: 7,
        character: [{ cardId: "EB01-005", rested: true, attachedDon: 3 }],
      },
      { character: ["EB01-005"], activeDon: 1 },
    );
    const target = e.findCardInZone("south", "character", "EB01-005");
    e.asSouth().play("OP15-025");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    e.endTurn("south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    e.endTurn("north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(false);
  }));
test.each([0, 1, 2])(
  "generated Fire Fist discards %i available hand cards and K.O.s only after two",
  (count) =>
    parsed("OP15-020", () => {
      let e = OnePieceTestEngine.create(
        { hand: ["OP15-020", ...Array.from({ length: count }, () => "EB01-005")], activeDon: 7 },
        { character: ["EB01-005"] },
      );
      const target = e.findCardInZone("north", "character", "EB01-005");
      e.asSouth().play("OP15-020");
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
      if (count === 2)
        e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(e.getView("south").players.south.hand).toHaveLength(0);
      expect(e.getView("south").players.north.trash.some((c) => c.instanceId === target)).toBe(
        count === 2,
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    }),
);
test("generated Amazon with no active opposing DON must offer the power reduction", () =>
  parsed("OP15-059", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP15-059"], hand: [] },
      { activeDon: 0, restedDon: 2 },
      { activeSeat: "north" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "south");
    expect(e.getView("south").players.north.leader?.power).toBe(3000);
    expect(e.getView("south").players.north.restedDon).toBe(2);
  }));
