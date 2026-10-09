import type { EngineCommand } from "../../src/types.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01ArtificialDevilFruitSmile116,
  op01DonquixoteDoflamingo073,
  op01KurozumiOrochi098,
  op11CharlottePudding070,
} from "@tcg/op-cards";

import { applyCommand, finalizeDraw, OnePieceTestEngine } from "../../src/index.ts";

// 11-1-1-1 is covered for audited deterministic non-moving mandatory cycles.
// Optional declarations are covered for exact deterministic public state cycles.
//
// 11-2-1 is proven with OP01-098 Kurozumi Orochi, the catalog's whole-deck
// named search. No catalog card uses the rule's "Add Monkey.D.Luffy from your
// deck to your hand" phrasing without reveal instructions; the rule's
// observable contract (a secret-to-secret move surfaces the moved card's
// identity publicly) is what the engine must honor for every such move.

function resolveOrochiSearch(engine: OnePieceTestEngine, smileId: string) {
  const south = engine.asSouth();
  south.play(op01KurozumiOrochi098);
  const search = south.pendingDecision("effectSearchSelection").steps[0];
  if (search?.kind !== "selectEntity") throw new Error("Expected Orochi's search choice.");
  expect(search.candidates.find((candidate) => candidate.ref.id === smileId)?.legal).toBe(true);
  south.chooseSearch(smileId);

  const remainder = south.pendingDecision("effectSearchRemainderOrder").steps[0];
  if (remainder?.kind !== "orderItems") throw new Error("Expected remainder ordering.");
  south.orderCards(
    "effectSearchRemainderOrder",
    remainder.candidates.map((candidate) => candidate.ref.id),
  );
}

function createOrochiSearch() {
  const engine = OnePieceTestEngine.create({
    hand: [op01KurozumiOrochi098],
    deck: [
      op01ArtificialDevilFruitSmile116,
      eb01Doma005,
      eb01MountainGod018,
      eb01Doma005,
      eb01MountainGod018,
    ],
    activeDon: op01KurozumiOrochi098.cost,
  });
  const smileId = engine.asSouth().findInZone("deck", op01ArtificialDevilFruitSmile116);
  return { engine, smileId };
}

describe("Comprehensive Rules 11. Other", () => {
  test.each(["mandatory", "optional", "finite"] as const)(
    "11-1-1-1: %s self-state cycle through public activation",
    (mode) => {
      // Synthetic card: no catalog unavoidable loop is established. Restore the
      // catalog entry even if a command or assertion fails.
      const card = getCard(eb01Doma005.id);
      const original = card.effects;
      const target = {
        player: "self",
        zones: ["character"],
        count: { amount: 1 },
        self: true,
      } as const;
      const rest: Action = { action: "rest", target: { ...target, zones: ["character"] } };
      const active: Action = { action: "setActive", target: { ...target, zones: ["character"] } };
      try {
        card.effects = {
          effects: [
            { trigger: "activateMain", actions: [rest] },
            {
              trigger: "whenBecomesRested",
              optional: mode === "optional",
              actions: mode === "finite" ? [active] : [active, rest],
            },
          ],
        };
        if (mode === "finite") {
          card.effects = {
            effects: [
              {
                trigger: "activateMain",
                actions: Array.from({ length: 12 }, () => [rest, active]).flat(),
              },
            ],
          };
        }
        const engine = OnePieceTestEngine.create({ character: [eb01Doma005] }, {});
        const source = engine.findCardInZone("south", "character", eb01Doma005);
        engine.activateEffect(source, "activateMain", "south");
        if (mode === "mandatory") {
          expect(engine.getView("south").status).toBe("finished");
          expect(engine.getView("south").finishReason).toBe("draw");
          expect(engine.getView("south").winner).toBeNull();
        } else if (mode === "optional") {
          expect(engine.getView("south").status).toBe("active");
          engine.pendingDecision("effectOptional", "south");
          engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
          expect(engine.getView("south").status).toBe("active");
          const declaration = engine.pendingDecision("loopIterations", "south");
          engine.exec({
            type: "resolvePrompt",
            seat: "south",
            promptId: declaration.id,
            iterations: 0,
          });
          expect(engine.getView("south").prompts).toHaveLength(0);
        } else {
          for (let repetition = 0; repetition < 3; repetition += 1) {
            engine.activateEffect(source, "activateMain", "south");
          }
          expect(engine.getView("south").status).toBe("active");
          expect(engine.getView("south").players.south.characters[0]?.rested).toBe(false);
          expect(engine.getView("south").prompts).toHaveLength(0);
        }
      } finally {
        card.effects = original;
      }
    },
  );

  test.each([0, 3, Number.MAX_SAFE_INTEGER])(
    "11-1-1-2: declares %s exact repetitions and forbids same-state restart",
    (iterations) => {
      const card = getCard(eb01Doma005.id);
      const original = card.effects;
      const target = {
        player: "self",
        zones: ["character"],
        count: { amount: 1 },
        self: true,
      } as const;
      const rest: Action = { action: "rest", target: { ...target, zones: ["character"] } };
      const active: Action = { action: "setActive", target: { ...target, zones: ["character"] } };
      try {
        card.effects = {
          effects: [
            { trigger: "activateMain", actions: [active, rest] },
            { trigger: "whenBecomesRested", optional: true, actions: [active, rest] },
          ],
        };
        let engine = OnePieceTestEngine.create({
          character: [eb01Doma005],
          hand: [eb01Doma005],
          activeDon: 10,
        });
        engine.activateEffect(
          engine.findCardInZone("south", "character", eb01Doma005),
          "activateMain",
          "south",
        );
        const blockedCommands: EngineCommand[] = [
          {
            type: "activateEffect",
            seat: "south",
            sourceInstanceId: engine.findCardInZone("south", "character", eb01Doma005),
            trigger: "activateMain",
          },
          { type: "attachDon", seat: "south", targetId: engine.leader("south"), amount: 1 },
          {
            type: "playCard",
            seat: "south",
            instanceId: engine.findCardInZone("south", "hand", eb01Doma005),
          },
          {
            type: "declareAttack",
            seat: "south",
            attackerId: engine.leader("south"),
            targetId: engine.leader("north"),
          },
        ];
        for (const command of blockedCommands) {
          const rejected = applyCommand(engine.getState(), command);
          expect(rejected.accepted).toBe(false);
          expect(rejected.state.optionalLoopEvidence).toEqual(
            engine.getState().optionalLoopEvidence,
          );
          engine = OnePieceTestEngine.fromState(rejected.state);
        }
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
        const declaration = engine.pendingDecision("loopIterations", "south");
        expect(declaration.steps[0]).toMatchObject({
          kind: "chooseNumber",
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          field: "iterations",
        });
        expect(JSON.stringify(engine.getView("north"))).not.toContain("fingerprint");
        for (const invalid of [-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
          const result = applyCommand(engine.getState(), {
            type: "resolvePrompt",
            seat: "south",
            promptId: declaration.id,
            iterations: invalid,
          });
          expect(result.accepted).toBe(false);
          expect(
            result.state.promptQueue.find((prompt) => prompt.id === declaration.id)?.status,
          ).toBe("pending");
        }
        const moved = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        const movedSource = moved.findCardInZone("south", "character", eb01Doma005);
        moved.exec({
          type: "judgeMoveCard",
          seat: "judge",
          instanceId: movedSource,
          owner: "south",
          zone: "trash",
        });
        expect(moved.getState().optionalLoopPlan).toBeUndefined();
        expect(moved.getView("south").prompts).toHaveLength(0);
        expect(
          moved.getView("south").players.south.trash.map((entry) => entry.instanceId),
        ).toContain(movedSource);

        const interrupted = OnePieceTestEngine.fromState(
          JSON.parse(JSON.stringify(engine.getState())),
        );
        interrupted.exec({
          type: "judgeResolvePrompt",
          seat: "judge",
          promptId: declaration.id,
          note: "Resume normal optional activation.",
        });
        expect(interrupted.getState().optionalLoopPlan).toBeUndefined();
        expect(interrupted.pendingDecision("effectOptional", "south")).toBeDefined();
        interrupted.resolveDecision("effectOptional", { optionId: "no" }, "south");
        expect(interrupted.getView("south").prompts).toHaveLength(0);

        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        engine.exec({ type: "resolvePrompt", seat: "south", promptId: declaration.id, iterations });
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        expect(engine.getView("south").prompts).toHaveLength(0);
        expect(engine.getView("south").status).toBe("active");
        expect(
          engine
            .getView("south")
            .logs.some((log) => log.message.includes(`The loop repeats ${iterations} times.`)),
        ).toBe(true);
        engine.activateEffect(
          engine.findCardInZone("south", "character", eb01Doma005),
          "activateMain",
          "south",
        );
        expect(engine.getView("south").prompts).toHaveLength(0);
        expect(
          engine.getView("south").logs.some((log) => log.message.includes("cannot be restarted")),
        ).toBe(true);
        // A changed card state permits a new voluntary loop.
        const source = engine.findCardInZone("south", "character", eb01Doma005);
        engine.attachDon(source, 1, "south");
        engine.activateEffect(source, "activateMain", "south");
        expect(engine.pendingDecision("effectOptional", "south")).toBeDefined();
        engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
        // A compulsory recurrence is not a voluntary restart: it still draws.
        card.effects.effects![1]!.optional = false;
        engine.activateEffect(
          engine.findCardInZone("south", "character", eb01Doma005),
          "activateMain",
          "south",
        );
        expect(engine.getView("south").finishReason).toBe("draw");
      } finally {
        card.effects = original;
      }
    },
  );

  test.each([
    [2, 5, "south"],
    [5, 2, "north"],
    [0, 0, "south"],
  ] as const)(
    "11-1-1-3: declares turn player %s, nonturn %s and stops at %s's choice",
    (turnCount, nonturnCount, stopper) => {
      const southCard = getCard(eb01Doma005.id);
      const northCard = getCard(eb01MountainGod018.id);
      const originalSouth = southCard.effects;
      const originalNorth = northCard.effects;
      const restOpponent: Action = {
        action: "rest",
        target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
      };
      const activeSelf: Action = {
        action: "setActive",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      };
      try {
        southCard.effects = {
          effects: [
            { trigger: "activateMain", actions: [restOpponent] },
            {
              trigger: "whenBecomesRested",
              eventFilter: { targetSelf: true },
              optional: true,
              actions: [activeSelf, restOpponent],
            },
          ],
        };
        northCard.effects = {
          effects: [
            {
              trigger: "whenBecomesRested",
              eventFilter: { targetSelf: true },
              optional: true,
              actions: [activeSelf, restOpponent],
            },
          ],
        };
        let engine = OnePieceTestEngine.create(
          { character: [eb01Doma005] },
          { character: [eb01MountainGod018] },
        );
        engine.activateEffect(
          engine.findCardInZone("south", "character", eb01Doma005),
          "activateMain",
          "south",
        );
        // Observe the certified two-seat cycle. Its boundary starts at north,
        // but declaration order must still start with the turn player south.
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
        const turnDeclaration = engine.pendingDecision("loopIterations", "south");
        expect(engine.getView("north").prompts).toHaveLength(0);
        const outOfOrder = applyCommand(engine.getState(), {
          type: "resolvePrompt",
          seat: "north",
          promptId: turnDeclaration.id,
          iterations: 1,
        });
        expect(outOfOrder.accepted).toBe(false);
        engine.exec({
          type: "resolvePrompt",
          seat: "south",
          promptId: turnDeclaration.id,
          iterations: turnCount,
        });
        engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
        const otherDeclaration = engine.pendingDecision("loopIterations", "north");
        engine.exec({
          type: "resolvePrompt",
          seat: "north",
          promptId: otherDeclaration.id,
          iterations: nonturnCount,
        });
        const view = engine.getView("south");
        expect(view.prompts).toHaveLength(0);
        expect(view.players[stopper].characters[0]?.rested).toBe(true);
        expect(view.players[stopper === "south" ? "north" : "south"].characters[0]?.rested).toBe(
          false,
        );
        expect(
          view.logs.some((log) =>
            log.message.includes(`The loop repeats ${Math.min(turnCount, nonturnCount)} times.`),
          ),
        ).toBe(true);
        expect(view.logs.findLast((log) => log.message.endsWith("stops the loop."))?.actor).toBe(
          stopper,
        );
        expect(view.status).toBe("active");
      } finally {
        southCard.effects = originalSouth;
        northCard.effects = originalNorth;
      }
    },
  );

  test("11-1: finite queued optional rest reactions do not declare a loop", () => {
    const card = getCard(eb01Doma005.id);
    const original = card.effects;
    const target = {
      player: "self",
      zones: ["character"],
      count: { amount: 1 },
      self: true,
    } as const;
    const rest: Action = { action: "rest", target: { ...target, zones: ["character"] } };
    const active: Action = { action: "setActive", target: { ...target, zones: ["character"] } };
    try {
      card.effects = {
        effects: [
          {
            trigger: "activateMain",
            actions: Array.from({ length: 4 }, () => [rest, active]).flat(),
          },
          { trigger: "whenBecomesRested", optional: true, actions: [] },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: [eb01Doma005] });
      engine.activateEffect(
        engine.findCardInZone("south", "character", eb01Doma005),
        "activateMain",
        "south",
      );
      for (let reaction = 0; reaction < 4; reaction += 1) {
        if (reaction < 3) {
          const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
          if (order.kind !== "chooseOption") throw new Error("Expected ready reactions.");
          engine.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "south");
        }
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      }
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getView("south").status).toBe("active");
      expect(engine.getState().optionalLoopPlan).toBeUndefined();
    } finally {
      card.effects = original;
    }
  });

  test("11-1: unaudited actions do not certify an optional loop", () => {
    const card = getCard(eb01Doma005.id);
    const original = card.effects;
    const rest: Action = {
      action: "rest",
      target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
    };
    const active: Action = {
      action: "setActive",
      target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
    };
    try {
      card.effects = {
        effects: [
          { trigger: "activateMain", actions: [rest] },
          {
            trigger: "whenBecomesRested",
            optional: true,
            actions: [{ action: "sequence", actions: [active, rest] }],
          },
        ],
      };
      const engine = OnePieceTestEngine.create({ character: [eb01Doma005] });
      engine.activateEffect(
        engine.findCardInZone("south", "character", eb01Doma005),
        "activateMain",
        "south",
      );
      for (let repeat = 0; repeat < 3; repeat += 1)
        engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      expect(engine.pendingDecision("effectOptional", "south")).toBeDefined();
      expect(engine.getState().optionalLoopPlan).toBeUndefined();
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
      expect(engine.getView("south").status).toBe("active");
    } finally {
      card.effects = original;
    }
  });

  test("11-1: the draw outcome is representable — the game ends with no winner", () => {
    const engine = OnePieceTestEngine.create({ life: 4, deck: 6 }, { life: 4, deck: 6 });
    const south = engine.asSouth();

    // Future infinite-loop detection (11-1-1) finalizes through finalizeDraw;
    // the terminal state it constructs is the 11-1 draw.
    finalizeDraw(engine.getState());

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBe("draw");
  });

  test("11-2-1: a card moved from deck to hand by a named search is revealed to both players", () => {
    const { engine, smileId } = createOrochiSearch();
    const south = engine.asSouth();
    const north = engine.asNorth();

    resolveOrochiSearch(engine, smileId);

    // The reveal is projected to both viewers as a public log naming the moved
    // card and identifying the physical instance.
    for (const view of [south.view(), north.view()]) {
      const revealLog = view.logs.find((entry) =>
        entry.message.includes(op01ArtificialDevilFruitSmile116.name),
      );
      expect(revealLog?.visibility).toBe("public");
      expect(revealLog?.message).toContain("reveals");
      expect(revealLog?.targetIds).toContain(smileId);
    }

    expect(south.view().prompts).toHaveLength(0);
  });

  test("11-2-2: a card revealed by an effect becomes unrevealed after that effect resolves", () => {
    const { engine, smileId } = createOrochiSearch();
    const south = engine.asSouth();
    const north = engine.asNorth();

    resolveOrochiSearch(engine, smileId);

    // After the whole On Play effect (search, add to hand, shuffle) resolves,
    // the opponent's projection of the hand conceals the revealed card again.
    const opponentHand = north.view().players.south.hand;
    expect(north.view().players.south.handCount).toBe(1);
    expect(opponentHand).toHaveLength(1);
    expect(opponentHand[0]).toMatchObject({
      hidden: true,
      instanceId: null,
      cardId: null,
      name: null,
    });

    // The controller's own view is unaffected: they can see their hand.
    expect(south.view().players.south.hand.map((card) => card.instanceId)).toContain(smileId);
  });

  test("11-3-1: a look-at effect exposes the secret card's identity only to the effect's player", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlottePudding070], activeDon: 1 },
      { deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const topCardName = eb01Doma005.name;

    south.activateMain(op11CharlottePudding070);
    south.acceptOptional();

    // The effect's player learns the identity of the opponent's top deck card.
    expect(south.view().logs.some((entry) => entry.message.includes(topCardName))).toBe(true);

    // The deck owner is only told that a look happened; the identity stays secret.
    const ownerView = north.view();
    expect(ownerView.logs.some((entry) => entry.message.includes("looks at the top card"))).toBe(
      true,
    );
    expect(ownerView.logs.some((entry) => entry.message.includes(topCardName))).toBe(false);
    expect(ownerView.players.north.deckTop?.hidden).toBe(true);
    expect(ownerView.players.north.deckTop?.cardId).toBeNull();
  });

  test("11-3-2: looked-at cards remain in their original area with no zone movement", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01DonquixoteDoflamingo073],
      deck: [
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op01DonquixoteDoflamingo073.cost,
    });
    const south = engine.asSouth();
    const north = engine.asNorth();
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);

    south.play(op01DonquixoteDoflamingo073);

    // The looking player receives all five identities as an ordering decision.
    const order = south.pendingDecision("effectRearrangeDeckOrder").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Doflamingo's deck order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lookedIds);

    // The opponent's projection gains no prompt, no decision, and no card name
    // while the cards are being looked at.
    const opponentView = north.view();
    expect(opponentView.prompts).toHaveLength(0);
    expect(
      opponentView.decisions.some(
        (decision) => decision.extensions?.resolutionIntent === "effectRearrangeDeckOrder",
      ),
    ).toBe(false);

    // Resolving the look keeps every looked-at card inside the deck zone.
    const chosenOrder = [...lookedIds].reverse();
    south.orderCards("effectRearrangeDeckOrder", chosenOrder);
    south.chooseOption("effectRearrangeDeckPosition", "top");

    const deckAfter = engine.getState().players.south.deck;
    expect(deckAfter).toHaveLength(6);
    expect(lookedIds.every((instanceId) => deckAfter.includes(instanceId))).toBe(true);
    expect(deckAfter.slice(0, 5)).toEqual(chosenOrder);
    expect(south.view().players.south.hand).toHaveLength(0);
    expect(south.view().players.south.trash).toHaveLength(0);
  });

  test("11-3-3: after a look with no instructed action, cards stay in their original state", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlottePudding070], activeDon: 1 },
      { deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018] },
    );
    const south = engine.asSouth();
    // Raw state is used only for identity and face state inside a hidden zone.
    const deckBefore = engine.getState().players.north.deck.map((instanceId) => ({
      instanceId,
      faceUp: engine.getState().cards[instanceId]?.faceUp,
      publicKnowledge: engine.getState().cards[instanceId]?.publicKnowledge,
    }));

    south.activateMain(op11CharlottePudding070);
    south.acceptOptional();

    const state = engine.getState();
    const deckAfter = state.players.north.deck.map((instanceId) => ({
      instanceId,
      faceUp: state.cards[instanceId]?.faceUp,
      publicKnowledge: state.cards[instanceId]?.publicKnowledge,
    }));
    expect(deckAfter).toEqual(deckBefore);
  });
});
