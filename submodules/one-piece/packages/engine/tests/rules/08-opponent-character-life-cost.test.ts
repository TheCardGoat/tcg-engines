import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Official OP09 FAQ: Kuzan cannot activate if its Character-to-Life cost cannot be paid.
test.each([{ characters: [] }, { characters: ["ST02-013"] }])(
  "Kuzan cannot discard without an eligible opposing payment target: %s",
  ({ characters }) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP09-101"], activeDon: 4, character: ["ST02-012"] },
      { character: characters, hand: ["ST02-002", "ST02-006"] },
    );
    e.asSouth().play("OP09-101");
    expect(e.getView("north").players.north.handCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  },
);

test.each(["top", "bottom"])(
  "Kuzan completes opposing face-up %s payment before opponent-owned discard",
  (position) => {
    let e = OnePieceTestEngine.create(
      { hand: ["OP09-101"], activeDon: 4 },
      {
        character: ["ST02-002", "ST02-012"],
        hand: ["ST02-002", "ST02-006"],
        life: ["ST02-012", "ST01-011"],
      },
    );
    const paid = e.findCardInZone("north", "character", "ST02-002"),
      old = e.getView("judge").players.north.life.map((c) => c.instanceId),
      discard = e.findCardInZone("north", "hand", "ST02-006");
    e.asSouth().play("OP09-101");
    const choose = e.pendingDecision("effectCostAddCharacterToLife", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: choose.id,
      selectedIds: [e.leader("north")],
    });
    e.resolveDecision("effectCostAddCharacterToLife", { selectedIds: [paid] }, "south");
    const p = e.pendingDecision("effectLifePosition", "south");
    expect(e.getView("north").players.north.handCount).toBe(2);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === paid)).toBe(
      true,
    );
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    const invalid = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: p.id,
      optionId: "middle",
    });
    expect(invalid.state.promptQueue.find((p) => p.id === choose.id)?.status).toBe("resolved");
    e = OnePieceTestEngine.fromState(invalid.state);
    e.resolveDecision("effectLifePosition", { optionId: position }, "south");
    expect(e.getView("judge").players.north.life.map((c) => c.instanceId)).toEqual(
      position === "top" ? [paid, ...old] : [...old, paid],
    );
    expect(e.getView("south").players.north.life.find((c) => c.instanceId === paid)?.cardId).toBe(
      "ST02-002",
    );
    e.asNorth().trashFromHand(discard);
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === discard)).toBe(true);
  },
);

test.each(["yes", "no"])(
  "Kuzan removal replacement %s controls actual cost completion",
  (choice) => {
    const target = getCard("ST02-002"),
      old = target.effects;
    try {
      // Explicit replacement fixture: isolate the generic colon-payment rule.
      target.effects = {
        replacementEffects: [
          {
            replacedEvent: "removeFromField",
            eventFilter: { targetSelf: true },
            replacementAction: { action: "trashThisCard" },
          },
        ],
      };
      let e = OnePieceTestEngine.create(
        { hand: ["OP09-101"], activeDon: 4 },
        { character: ["ST02-002"], hand: ["ST02-006", "ST02-012"] },
      );
      const paid = e.findCardInZone("north", "character", "ST02-002");
      e.asSouth().play("OP09-101");
      e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectRemovalReplacement", { optionId: choice }, "north");
      if (choice === "no") e.asNorth().trashFromHand("ST02-006");
      expect(e.getView("north").players.north.handCount).toBe(choice === "yes" ? 2 : 1);
      expect(e.getView("south").players.north.life.some((c) => c.instanceId === paid)).toBe(
        choice === "no",
      );
      expect(e.getView("north").players.north.trash.some((c) => c.instanceId === paid)).toBe(
        choice === "yes",
      );
    } finally {
      target.effects = old;
    }
  },
);

test("an opposing removal-protected Character cannot pay Kuzan's activation cost", () => {
  const card = getCard("ST02-002"),
    original = card.effects;
  try {
    // Synthetic protection isolates performable-cost eligibility at printed cost3.
    card.effects = {
      permanentEffects: [
        {
          actions: [
            {
              action: "cannotBeRemoved",
              target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
              duration: "permanent",
              bySource: "opponentEffect",
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      { hand: ["OP09-101"], activeDon: 4 },
      { character: ["ST02-002"], hand: ["ST02-006", "ST02-012"] },
    );
    e.asSouth().play("OP09-101");
    expect(e.getView("north").players.north.handCount).toBe(2);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});
