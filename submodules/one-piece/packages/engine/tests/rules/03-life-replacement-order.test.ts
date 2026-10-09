import { getCard } from "@tcg/op-cards";
import type { EffectBlock } from "@tcg/op-types";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

function fixture(block: EffectBlock, run: () => void) {
  // Rules fixture: the catalog currently has no simultaneous two-Life add.
  // Use the real Luffy replacement and change only a vanilla Character's ability.
  const card = getCard("ST02-002"),
    old = card.effects;
  try {
    card.effects = { effects: [block] };
    run();
  } finally {
    card.effects = old;
  }
}
const life = [
  { cardId: "ST02-006", faceUp: true, publicKnowledge: true },
  { cardId: "ST02-012", faceUp: true, publicKnowledge: true },
];

test("3-1-7/8: opposing owner privately orders replaced simultaneous Life movement before next action", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        { action: "removeFromLife", player: "opponent", count: { amount: 2 }, destination: "hand" },
        { action: "draw", player: "self", amount: 1 },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create(
        { character: ["ST02-002"] },
        { leaderCardId: "ST13-003", life },
      );
      const ids = e.getView("judge").players.north.life.map((c) => c.instanceId!);
      e.asSouth().activateMain("ST02-002");
      const prompt = e.pendingDecision("effectLifeReplacementOrder", "north");
      expect(e.getView("south").players.south.handCount).toBe(0);
      expect(
        e
          .getView("south")
          .decisions.some((d) => d.steps.some((step) => step.kind === "orderItems")),
      ).toBe(false);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      const wrongSeat = e.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: prompt.id,
        selectedIds: [...ids].reverse(),
      });
      e = OnePieceTestEngine.fromState(wrongSeat.state);
      const rejected = e.expectFailure({
        type: "resolvePrompt",
        seat: "north",
        promptId: prompt.id,
        selectedIds: [ids[0]!, ids[0]!],
      });
      expect(rejected.state.promptQueue.find((p) => p.id === prompt.id)?.status).toBe("pending");
      expect(rejected.state.players.north.deck).toEqual(e.getState().players.north.deck);
      e = OnePieceTestEngine.fromState(rejected.state);
      e.asNorth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
      expect(e.getState().players.north.deck.slice(-2)).toEqual([...ids].reverse());
      expect(e.getView("south").players.south.handCount).toBe(1);
      expect(e.getView("north").players.north.handCount).toBe(0);
    },
  ));

test.each([true, false])(
  "replaced multi-Life cost orders cards without paying the body; accepted=%s",
  (accept) =>
    fixture(
      {
        trigger: "activateMain",
        optional: true,
        costs: [{ cost: "addLifeToHand", amount: 2 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
      () => {
        const e = OnePieceTestEngine.create({
          leaderCardId: "ST13-003",
          character: ["ST02-002"],
          life,
        });
        const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!);
        e.asSouth().activateMain("ST02-002");
        if (accept) {
          e.asSouth().acceptOptional();
          e.asSouth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
          expect(e.getState().players.south.deck.slice(-2)).toEqual([...ids].reverse());
        } else e.asSouth().declineOptional();
        expect(e.getView("south").players.south.handCount).toBe(0);
        expect(e.getView("south").players.south.lifeCount).toBe(accept ? 0 : 2);
      },
    ),
);

test("one simultaneous return spanning both owners preserves independent private orders", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        {
          action: "returnToHand",
          target: { player: "any", zones: ["life"], count: { amount: "all" } },
        },
        { action: "draw", player: "self", amount: 0, amountFromPreviousActionTargets: true },
      ],
    },
    () => {
      let e = OnePieceTestEngine.create(
        { leaderCardId: "ST13-003", character: ["ST02-002"], life },
        { leaderCardId: "ST13-003", life },
      );
      const south = e.getView("judge").players.south.life.map((c) => c.instanceId!),
        north = e.getView("judge").players.north.life.map((c) => c.instanceId!);
      e.asSouth().activateMain("ST02-002");
      e.asSouth().orderCards("effectLifeReplacementOrder", [...south].reverse());
      expect(e.getView("south").players.south.handCount).toBe(0);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asNorth().orderCards("effectLifeReplacementOrder", [...north].reverse());
      // Raw IDs are needed only to verify private deck order.
      expect(e.getState().players.south.deck.slice(-2)).toEqual([...south].reverse());
      expect(e.getState().players.north.deck.slice(-2)).toEqual([...north].reverse());
      expect(e.getView("south").players.south.handCount).toBe(0);
      expect(e.getView("north").players.north.handCount).toBe(0);
    },
  ));

test("only replaced face-up cards share the order; face-down Life reaches hand once", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        { action: "removeFromLife", player: "self", count: { amount: 3 }, destination: "hand" },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        character: ["ST02-002"],
        life: [life[0]!, "ST01-011", life[1]!],
      });
      const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!);
      e.asSouth().activateMain("ST02-002");
      const step = e.pendingDecision("effectLifeReplacementOrder", "south").steps[0];
      if (step?.kind !== "orderItems") throw Error("order");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([ids[0], ids[2]]);
      e.asSouth().orderCards("effectLifeReplacementOrder", [ids[2]!, ids[0]!]);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([ids[1]]);
      expect(e.getState().players.south.deck.slice(-2)).toEqual([ids[2], ids[0]]);
    },
  ));

test("ordering a replaced cost preserves later independent bottom-deck payment", () =>
  fixture(
    {
      trigger: "activateMain",
      optional: true,
      costs: [
        { cost: "addLifeToHand", amount: 2 },
        { cost: "returnTrashToDeck", amount: 1, position: "bottom" },
      ],
      actions: [{ action: "draw", player: "self", amount: 1 }],
    },
    () => {
      let e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        character: ["ST02-002"],
        life,
        trash: ["ST01-011", "ST01-004"],
      });
      const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!),
        later = e.findCardInZone("south", "trash", "ST01-011");
      e.asSouth().activateMain("ST02-002");
      e.asSouth().acceptOptional();
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
      e.pendingDecision("effectCostReturnTrashToDeck", "south");
      expect(e.getView("south").players.south.handCount).toBe(0);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [later] }, "south");
      expect(e.getState().players.south.deck.slice(-3)).toEqual([...ids].reverse().concat(later));
      expect(e.getView("south").players.south.handCount).toBe(0);
    },
  ));

test("ordinary two face-down Life adds stay prompt-free and complete the following action", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        { action: "removeFromLife", player: "self", count: { amount: 2 }, destination: "hand" },
        { action: "draw", player: "self", amount: 1 },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        character: ["ST02-002"],
        life: ["ST02-006", "ST02-012"],
      });
      e.asSouth().activateMain("ST02-002");
      expect(e.getView("south").players.south.handCount).toBe(3);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  ));

test("nested return continuation waits for Life replacement order before drawing into that batch", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        {
          action: "returnToHand",
          target: { player: "self", zones: ["life"], count: { amount: 2 } },
          thenActions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        character: ["ST02-002"],
        life,
        deck: ["ST01-011"],
      });
      const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!),
        oldTop = e.findCardInZone("south", "deck", "ST01-011");
      e.asSouth().activateMain("ST02-002");
      expect(e.getView("south").players.south.handCount).toBe(0);
      e.asSouth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([
        oldTop,
        ids[1],
      ]);
      expect(e.getState().players.south.deck).toEqual([ids[0]]);
    },
  ));

test("nested return count uses completed hand arrivals after Life replacement", () =>
  fixture(
    {
      trigger: "activateMain",
      actions: [
        {
          action: "returnToHand",
          target: { player: "self", zones: ["life"], count: { amount: 2 } },
          thenActions: [
            { action: "draw", player: "self", amount: 0, amountFromPreviousActionTargets: true },
          ],
        },
      ],
    },
    () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST13-003",
        character: ["ST02-002"],
        life,
        deck: ["ST01-011"],
      });
      const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!);
      e.asSouth().activateMain("ST02-002");
      e.asSouth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
      expect(e.getView("south").players.south.handCount).toBe(0);
      expect(e.getView("south").players.south.deckCount).toBe(3);
    },
  ));

test.each([false, true])(
  "mixed-zone replacement draw sees private Life order; field first=%s",
  (fieldFirst) =>
    fixture(
      {
        trigger: "activateMain",
        actions: [
          {
            action: "returnToHand",
            target: { player: "self", zones: ["life", "character"], count: { amount: 3 } },
          },
        ],
      },
      () => {
        const blocker = getCard("ST01-006"),
          original = blocker.effects;
        try {
          // Rules fixture: the catalog has no mixed Life/field multi-return.
          // CR3-1-7/8 requires the Life batch order before another replacement
          // can draw from its destination (CR8-1-3-4-4/4-4-1).
          blocker.effects = {
            replacementEffects: [
              {
                replacedEvent: "removeFromField",
                eventFilter: { targetSelf: true },
                replacementAction: {
                  action: "sequence",
                  actions: [
                    { action: "draw", player: "self", amount: 2 },
                    {
                      action: "returnToDeck",
                      target: { player: "self", zones: ["hand"], count: { amount: "all" } },
                      position: "bottom",
                      order: "any",
                    },
                  ],
                },
              },
            ],
          };
          let e = OnePieceTestEngine.create({
            leaderCardId: "ST13-003",
            character: ["ST02-002", "ST01-006"],
            life,
            deck: ["ST01-011"],
          });
          const ids = e.getView("judge").players.south.life.map((c) => c.instanceId!),
            oldTop = e.findCardInZone("south", "deck", "ST01-011"),
            target = e.findCardInZone("south", "character", "ST01-006");
          e.asSouth().activateMain("ST02-002");
          e.asSouth().chooseTargets(...(fieldFirst ? [target, ...ids] : [...ids, target]));
          e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
          e.asSouth().orderCards("effectLifeReplacementOrder", [...ids].reverse());
          e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
          expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([
            oldTop,
            ids[1],
          ]);
          e.asSouth().orderCards("effectReturnToDeckOwnerOrder", [ids[1]!, oldTop]);
          expect(e.getState().players.south.deck).toEqual([ids[0], ids[1], oldTop]);
          expect(e.getView("south").prompts).toHaveLength(0);
        } finally {
          blocker.effects = original;
        }
      },
    ),
);

test.each(["yes", "no"])(
  "mixed-zone batch preserves each owner's order and replacement choice %s",
  (optionId) =>
    fixture(
      {
        trigger: "activateMain",
        actions: [
          {
            action: "returnToHand",
            condition: { condition: "lifeCount", player: "self", comparison: "gte", value: 2 },
            target: { player: "any", zones: ["life", "character"], count: { amount: 5 } },
          },
        ],
      },
      () => {
        const blocker = getCard("ST01-006"),
          original = blocker.effects;
        try {
          // Explicit rules fixture: the real mandatory Luffy replacements belong
          // to different owners; the opposing Character has an optional draw replacement.
          blocker.effects = {
            replacementEffects: [
              {
                replacedEvent: "removeFromField",
                eventFilter: { targetSelf: true },
                replacementAction: { action: "draw", player: "self", amount: 2 },
              },
            ],
          };
          let e = OnePieceTestEngine.create(
            { leaderCardId: "ST13-003", character: ["ST02-002"], life, deck: ["ST01-011"] },
            { leaderCardId: "ST13-003", character: ["ST01-006"], life, deck: ["ST01-011"] },
          );
          const south = e.getView("judge").players.south.life.map((c) => c.instanceId!),
            north = e.getView("judge").players.north.life.map((c) => c.instanceId!),
            top = e.findCardInZone("north", "deck", "ST01-011"),
            target = e.findCardInZone("north", "character", "ST01-006");
          e.asSouth().activateMain("ST02-002");
          e.asSouth().chooseTargets(target, south[0]!, north[0]!, south[1]!, north[1]!);
          e.asSouth().orderCards("effectLifeReplacementOrder", [...south].reverse());
          e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
          const prompt = e.pendingDecision("effectLifeReplacementOrder", "north");
          expect(e.getView("north").players.north.handCount).toBe(0);
          const wrongSeat = e.expectFailure({
            type: "resolvePrompt",
            seat: "south",
            promptId: prompt.id,
            selectedIds: [...north].reverse(),
          });
          e = OnePieceTestEngine.fromState(wrongSeat.state);
          const duplicate = e.expectFailure({
            type: "resolvePrompt",
            seat: "north",
            promptId: prompt.id,
            selectedIds: [north[0]!, north[0]!],
          });
          e = OnePieceTestEngine.fromState(duplicate.state);
          e.pendingDecision("effectLifeReplacementOrder", "north");
          e.asNorth().orderCards("effectLifeReplacementOrder", [...north].reverse());
          e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
          e.resolveDecision("effectRemovalReplacement", { optionId }, "north");
          // Raw IDs are needed only to verify private deck order.
          expect(e.getState().players.south.deck.slice(-2)).toEqual([...south].reverse());
          if (optionId === "yes") {
            expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toEqual([
              top,
              north[1],
            ]);
            expect(e.getState().players.north.deck).toEqual([north[0]]);
            expect(e.findCardInZone("north", "character", "ST01-006")).toBe(target);
          } else {
            expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toEqual([
              target,
            ]);
            expect(e.getState().players.north.deck).toEqual([top, ...north.toReversed()]);
          }
          expect(e.getView("south").prompts).toHaveLength(0);
        } finally {
          blocker.effects = original;
        }
      },
    ),
);
