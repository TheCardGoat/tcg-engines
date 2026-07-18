import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard, EventCard, StageCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01OffWhite019,
  eb02ThePeak008,
  op01ArtificialDevilFruitSmile116,
  op01Crocodile067,
  op01KurozumiOrochi098,
  op01RadicalBeam029,
  op02Smoker102,
  op05Enel100,
  op08Nekomamushi028,
  op08MobyDick056,
  op14eb04Tashigi029,
} from "@tcg/op-cards";

import { registerCards } from "../../../cards/src/runtime-catalog.ts";
import { evaluateConditions } from "../../src/effects/conditions.ts";
import { findRemoveFromFieldReplacement } from "../../src/effects/replacements.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const bounceReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-BOUNCE",
  canonicalId: "TEST-REVIEW-BOUNCE",
  name: "Review Bounce",
  cost: 0,
  effect: "[Main] Return up to 1 of your opponent's Characters to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

const topRemainderReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-TOP-REMAINDER",
  canonicalId: "TEST-REVIEW-TOP-REMAINDER",
  name: "Review Top Remainder",
  cost: 0,
  effect:
    "[Main] Look at 3 cards from the top of your deck; add up to 1 card to your hand. Then, place the rest at the top of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealDestination: "hand",
            remainderPosition: "top",
          },
        ],
      },
    ],
  },
};

const returnDonReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-RETURN-DON",
  canonicalId: "TEST-REVIEW-RETURN-DON",
  name: "Review Return DON",
  cost: 0,
  effect: "[Main] Your opponent returns 2 DON!! cards from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [{ action: "returnDon", player: "opponent", amount: 2 }],
      },
    ],
  },
};

const addCharacterToLifeReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-ADD-CHARACTER-TO-LIFE",
  canonicalId: "TEST-REVIEW-ADD-CHARACTER-TO-LIFE",
  name: "Review Add Character To Life",
  cost: 0,
  effect: "[Main] Add up to 1 of your opponent's Characters to the top of their Life.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            position: "top",
            faceUp: false,
          },
        ],
      },
    ],
  },
};

const returnCharacterToDeckReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-RETURN-CHARACTER-TO-DECK",
  canonicalId: "TEST-REVIEW-RETURN-CHARACTER-TO-DECK",
  name: "Review Return Character To Deck",
  cost: 0,
  effect: "[Main] Place up to 1 of your opponent's Characters at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
};

const mixedHiddenTargetReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-MIXED-HIDDEN-TARGET",
  canonicalId: "TEST-REVIEW-MIXED-HIDDEN-TARGET",
  name: "Review Mixed Hidden Target",
  cost: 0,
  effect:
    "[Main] Your opponent places 1 card from your hand or 1 of your Characters at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand", "character"],
              count: { amount: 1 },
              chosenBy: "opponent",
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
};

const replacementWhitebeardReviewCharacter: CharacterCard = {
  ...op14eb04Tashigi029,
  id: "TEST-REVIEW-REPLACEMENT-WHITEBEARD",
  canonicalId: "TEST-REVIEW-REPLACEMENT-WHITEBEARD",
  name: "Review Replacement Whitebeard",
  traits: ["Whitebeard Pirates"],
};

const zeroCostReviewCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-REVIEW-ZERO-COST",
  canonicalId: "TEST-REVIEW-ZERO-COST",
  name: "Review Zero Cost Character",
  cost: 0,
};

const trashHandReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-TRASH-HAND",
  canonicalId: "TEST-REVIEW-TRASH-HAND",
  name: "Review Trash Hand",
  cost: 0,
  effect: "[Main] Trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [{ action: "trashFromHand", player: "self", amount: 1 }],
      },
    ],
  },
};

const zeroCostReviewStage: StageCard = {
  ...op08MobyDick056,
  id: "TEST-REVIEW-ZERO-COST-STAGE",
  canonicalId: "TEST-REVIEW-ZERO-COST-STAGE",
  name: "Review Zero Cost Stage",
  cost: 0,
  effects: undefined,
};

const playStageReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-PLAY-STAGE",
  canonicalId: "TEST-REVIEW-PLAY-STAGE",
  name: "Review Play Stage",
  cost: 0,
  effect: "[Main] Play 1 Stage card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1 },
            filters: [{ filter: "cardCategory", value: "stage" }],
          },
        ],
      },
    ],
  },
};

const removeLifeToHandReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-REMOVE-LIFE-TO-HAND",
  canonicalId: "TEST-REVIEW-REMOVE-LIFE-TO-HAND",
  name: "Review Remove Life To Hand",
  cost: 0,
  effect: "[Main] Add 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: { amount: 1 },
            destination: "hand",
          },
        ],
      },
    ],
  },
};

const removeLifeToDeckReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-REMOVE-LIFE-TO-DECK",
  canonicalId: "TEST-REVIEW-REMOVE-LIFE-TO-DECK",
  name: "Review Remove Life To Deck",
  cost: 0,
  effect: "[Main] Place 1 card from your opponent's Life at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: { amount: 1 },
            destination: "deck",
            destinationPosition: "bottom",
          },
        ],
      },
    ],
  },
};

const removalListenerReviewStage: StageCard = {
  ...op08MobyDick056,
  id: "TEST-REVIEW-REMOVAL-LISTENER",
  canonicalId: "TEST-REVIEW-REMOVAL-LISTENER",
  name: "Review Removal Listener",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        eventFilter: {
          player: "self",
          filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
        },
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

const characterRemovedListenerReviewStage: StageCard = {
  ...op08MobyDick056,
  id: "TEST-REVIEW-CHARACTER-REMOVED-LISTENER",
  canonicalId: "TEST-REVIEW-CHARACTER-REMOVED-LISTENER",
  name: "Review Character Removed Listener",
  effects: {
    effects: [
      {
        trigger: "whenCharacterRemoved",
        eventFilter: {
          player: "self",
          causedBy: "opponent",
        },
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

const koReviewEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-REVIEW-KO",
  canonicalId: "TEST-REVIEW-KO",
  name: "Review K.O.",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

const koListenerReviewStage: StageCard = {
  ...op08MobyDick056,
  id: "TEST-REVIEW-KO-LISTENER",
  canonicalId: "TEST-REVIEW-KO-LISTENER",
  name: "Review K.O. Listener",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: { player: "opponent" },
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
};

registerCards([
  bounceReviewEvent,
  topRemainderReviewEvent,
  returnDonReviewEvent,
  addCharacterToLifeReviewEvent,
  returnCharacterToDeckReviewEvent,
  mixedHiddenTargetReviewEvent,
  replacementWhitebeardReviewCharacter,
  zeroCostReviewCharacter,
  trashHandReviewEvent,
  zeroCostReviewStage,
  playStageReviewEvent,
  removeLifeToHandReviewEvent,
  removeLifeToDeckReviewEvent,
  removalListenerReviewStage,
  characterRemovedListenerReviewStage,
  koReviewEvent,
  koListenerReviewStage,
]);

describe("review regressions", () => {
  test("accepts a visible target from a mixed visible and concealed opponent choice", () => {
    const createEngine = () =>
      OnePieceTestEngine.create(
        {
          hand: [mixedHiddenTargetReviewEvent, eb01Fourtricks025],
          character: [eb01Doma005],
        },
        {},
      );

    const spoofed = createEngine();
    const concealedHandId = spoofed.findCardInZone("south", "hand", eb01Fourtricks025);
    spoofed.playCard(mixedHiddenTargetReviewEvent, "south");
    expect(() =>
      spoofed.resolveDecision("effectTargetSelection", { selectedIds: [concealedHandId] }, "north"),
    ).toThrow();
    expect(spoofed.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      concealedHandId,
    );

    const engine = createEngine();
    const visibleCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const concealedCandidateId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    engine.playCard(mixedHiddenTargetReviewEvent, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") throw new Error("Expected a mixed target choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(visibleCharacterId);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      concealedCandidateId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [visibleCharacterId] }, "north");

    expect(engine.getState().players.south.deck).toContain(visibleCharacterId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("sends a directly played foreign-owned Event to its original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {},
      { hand: [bounceReviewEvent] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const eventId = engine.findCardInZone("north", "hand", bounceReviewEvent);
    engine.getState().cards[eventId]!.owner = "south";

    engine.playCard(bounceReviewEvent, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(
      engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(eventId);
    expect(engine.getState().cards[eventId]).toMatchObject({
      owner: "south",
      controller: "south",
      zone: "trash",
    });
  });

  test("sends a foreign-owned card discarded by an effect to its original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {},
      { hand: [trashHandReviewEvent, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const discardedId = engine.findCardInZone("north", "hand", eb01Doma005);
    engine.getState().cards[discardedId]!.owner = "south";

    engine.playCard(trashHandReviewEvent, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );
    expect(
      engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(discardedId);
  });

  test("sends foreign-owned Character and Event counters to their original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005, op01RadicalBeam029],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const characterCounterId = engine.findCardInZone("north", "hand", eb01Doma005);
    const eventCounterId = engine.findCardInZone("north", "hand", op01RadicalBeam029);
    engine.getState().cards[characterCounterId]!.owner = "south";
    engine.getState().cards[eventCounterId]!.owner = "south";
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision(
      "battleCounter",
      { selectedIds: [characterCounterId, eventCounterId] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const southTrash = engine.getView("south").players.south.trash.map((card) => card.instanceId);
    expect(southTrash).toEqual(expect.arrayContaining([characterCounterId, eventCounterId]));
    const northTrash = engine.getView("north").players.north.trash.map((card) => card.instanceId);
    expect(northTrash).not.toContain(characterCounterId);
    expect(northTrash).not.toContain(eventCounterId);
  });

  test("sends a directly replaced foreign-owned Stage to its original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {},
      { hand: [zeroCostReviewStage], stage: zeroCostReviewStage },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const replacedId = engine.findCardInZone("north", "stage", zeroCostReviewStage);
    engine.getState().cards[replacedId]!.owner = "south";

    engine.playCard(zeroCostReviewStage, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      replacedId,
    );
    expect(
      engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(replacedId);
  });

  test("sends an effect-replaced foreign-owned Stage to its original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        hand: [playStageReviewEvent, zeroCostReviewStage],
        stage: zeroCostReviewStage,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const replacedId = engine.findCardInZone("north", "stage", zeroCostReviewStage);
    engine.getState().cards[replacedId]!.owner = "south";

    engine.playCard(playStageReviewEvent, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      replacedId,
    );
    expect(
      engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(replacedId);
  });

  test("sends a foreign-owned Life card to its Life controller's hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [removeLifeToHandReviewEvent] },
      { life: [eb01Doma005] },
    );
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.getState().cards[lifeId]!.owner = "south";

    engine.playCard(removeLifeToHandReviewEvent, "south");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).not.toContain(
      lifeId,
    );
    expect(engine.getState().cards[lifeId]).toMatchObject({
      owner: "south",
      controller: "north",
      zone: "hand",
    });
  });

  test("sends a foreign-owned Life card to the bottom of its Life controller's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [removeLifeToDeckReviewEvent],
        deck: [eb01Fourtricks025],
      },
      { life: [eb01Doma005] },
    );
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.getState().cards[lifeId]!.owner = "south";

    engine.playCard(removeLifeToDeckReviewEvent, "south");
    const choice = engine.pendingDecision("effectRemoveFromLifeSelection", "south").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") {
      throw new Error("Expected the Life card selection.");
    }
    engine.resolveDecision(
      "effectRemoveFromLifeSelection",
      { selectedIds: [choice.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getState().players.north.deck.at(-1)).toBe(lifeId);
    expect(engine.getState().players.south.deck).not.toContain(lifeId);
    expect(engine.getState().cards[lifeId]).toMatchObject({
      owner: "south",
      controller: "north",
      zone: "deck",
    });
  });

  test("sends a Banished foreign-owned Life card to its original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Crocodile067, playedOnTurn: 0 }] },
      { life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Crocodile067);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.getState().cards[lifeId]!.owner = "south";

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(engine.getState().cards[lifeId]).toMatchObject({
      owner: "south",
      controller: "south",
      zone: "trash",
    });
  });

  test("routes a cross-controlled battle K.O. to the original owner's Trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.getState().cards[targetId]!.owner = "south";

    engine.declareAttack(attackerId, targetId, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(targetId);
    expect(engine.getState().cards[targetId]).toMatchObject({
      owner: "south",
      controller: "south",
      zone: "trash",
    });
  });

  test("evaluates effect K.O. player filters from the target controller at event time", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [koReviewEvent],
        deck: [eb01Fourtricks025],
        stage: koListenerReviewStage,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.getState().cards[targetId]!.owner = "south";
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.playCard(koReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.hand).toHaveLength(handBefore);
    expect(view.players.south.deckCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("evaluates generic removal filters from the target controller at event time", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Doma005],
        stage: characterRemovedListenerReviewStage,
        deck: [eb01Fourtricks025],
      },
      { hand: [bounceReviewEvent] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.getState().cards[targetId]!.owner = "north";

    engine.playCard(bounceReviewEvent, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(0);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("evaluates when-leaving filters from the target controller at event time", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [replacementWhitebeardReviewCharacter],
        stage: removalListenerReviewStage,
        deck: [eb01Fourtricks025],
      },
      { hand: [bounceReviewEvent] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone(
      "south",
      "character",
      replacementWhitebeardReviewCharacter,
    );
    engine.getState().cards[targetId]!.owner = "north";

    engine.playCard(bounceReviewEvent, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").players.south.deckCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("counts filtered rested cards across the complete field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Nekomamushi028] },
      {
        character: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        stage: eb02ThePeak008,
      },
    );
    const state = engine.getState();
    const north = state.players.north;
    for (const instanceId of [
      north.leaderInstanceId,
      ...north.characterArea.filter((id): id is string => id !== null),
      north.stageArea!,
    ]) {
      state.cards[instanceId]!.rested = true;
    }

    expect(
      evaluateConditions(
        state,
        "south",
        engine.findCardInZone("south", "character", op08Nekomamushi028),
        [
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "field",
            comparison: "gte",
            value: 7,
            filters: [{ filter: "state", value: "rested" }],
          },
        ],
      ),
    ).toEqual({ supported: true, matches: true });
  });

  test("searches the complete deck when lookCount zero is the whole-deck sentinel", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01KurozumiOrochi098],
      deck: [eb01Doma005, op01ArtificialDevilFruitSmile116],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "deck", op01ArtificialDevilFruitSmile116);

    engine.playCard(op01KurozumiOrochi098, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Orochi's whole-deck search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id !== eventId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("lets an unqualified field condition see an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Smoker102, playedOnTurn: 0 }] },
      { hand: [eb01Doma005], character: [zeroCostReviewCharacter] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smokerId = engine.findCardInZone("south", "character", op02Smoker102);

    engine.declareAttack(smokerId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smokerId)
        ?.power,
    ).toBe(6000);
  });

  test("offers remove-from-field replacement before a return-to-hand effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [bounceReviewEvent] },
      { character: [op14eb04Tashigi029], activeDon: 0 },
    );
    const tashigiId = engine.findCardInZone("north", "character", op14eb04Tashigi029);
    const leaderId = engine.leader("north");
    expect(
      findRemoveFromFieldReplacement(
        engine.getState(),
        tashigiId,
        "south",
        engine.findCardInZone("south", "hand", bounceReviewEvent),
      ),
    ).not.toBeNull();

    engine.playCard(bounceReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
    const payment = engine.pendingDecision("effectMixedRestSelection", "north").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected a field-or-DON!! rest choice.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId, tashigiId]);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [leaderId] }, "north");

    expect(engine.findCardInZone("north", "character", op14eb04Tashigi029)).toBe(tashigiId);
    expect(engine.getView("north").players.north.leader.rested).toBe(true);
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("offers a leave-field replacement before return-to-hand removal", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [bounceReviewEvent] },
      { life: [eb01Doma005], character: [op05Enel100] },
    );
    const enelId = engine.findCardInZone("north", "character", op05Enel100);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.playCard(bounceReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, "south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");

    expect(engine.findCardInZone("north", "character", op05Enel100)).toBe(enelId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("offers a leave-field replacement once before battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op05Enel100, rested: true }],
      },
      {
        character: [
          { card: eb01MountainGod018, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01MountainGod018, attachedDon: 1, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const enelId = engine.findCardInZone("south", "character", op05Enel100);
    const attackers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(attackers[0]!, enelId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");

    expect(engine.findCardInZone("south", "character", op05Enel100)).toBe(enelId);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);

    engine.declareAttack(attackers[1]!, enelId, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      enelId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("returns an ordered search remainder to the top of the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [topRemainderReviewEvent],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    });
    const selectedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const firstRemainderId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondRemainderId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(topRemainderReviewEvent, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [firstRemainderId, secondRemainderId] },
      "south",
    );

    expect(engine.getState().players.south.deck.slice(0, 2)).toEqual([
      firstRemainderId,
      secondRemainderId,
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the opponent choose every DON!! required across multiple sources", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [returnDonReviewEvent] },
      {
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: 2,
        donDeckCount: 7,
      },
    );

    engine.playCard(returnDonReviewEvent, "south");
    const payment = engine.pendingDecision("effectOpponentReturnDon", "north").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected a two-DON!! payment choice.");
    expect(payment.candidates).toHaveLength(3);
    engine.resolveDecision(
      "effectOpponentReturnDon",
      {
        selectedIds: [
          payment.candidates[0]!.ref.id,
          payment.candidates[payment.candidates.length - 1]!.ref.id,
        ],
      },
      "north",
    );

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 1,
      donDeckCount: 9,
    });
    expect(engine.getView("north").players.north.characters[0]?.attachedDon).toBe(0);
  });

  test("returns attached DON!! before moving a Character into Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [addCharacterToLifeReviewEvent] },
      { character: [{ card: eb01Doma005, attachedDon: 2 }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(addCharacterToLifeReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.life).toContain(targetId);
    expect(engine.getState().cards[targetId]?.attachedDon).toBe(0);
    expect(engine.getView("north").players.north.restedDon).toBe(2);
  });

  test("moves a foreign-owned opposing Character into the targeted opponent's Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [addCharacterToLifeReviewEvent] },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.getState().cards[targetId]!.owner = "south";

    engine.playCard(addCharacterToLifeReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.life).toContain(targetId);
    expect(engine.getState().players.south.life).not.toContain(targetId);
    expect(engine.getState().cards[targetId]).toMatchObject({
      owner: "south",
      controller: "north",
      zone: "life",
    });
  });

  test("returns attached DON!! before moving a Character into the deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [returnCharacterToDeckReviewEvent] },
      { character: [{ card: eb01Doma005, attachedDon: 2 }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(returnCharacterToDeckReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.deck).toContain(targetId);
    expect(engine.getState().cards[targetId]?.attachedDon).toBe(0);
    expect(engine.getView("north").players.north.restedDon).toBe(2);
  });

  test("publishes removal reactions after a replacement is declined", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [bounceReviewEvent] },
      {
        character: [replacementWhitebeardReviewCharacter],
        stage: removalListenerReviewStage,
        deck: [eb01Doma005],
        activeDon: 1,
      },
    );
    const targetId = engine.findCardInZone(
      "north",
      "character",
      replacementWhitebeardReviewCharacter,
    );

    engine.playCard(bounceReviewEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "north");

    expect(engine.getView("north").players.north.handCount).toBe(2);
    expect(engine.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
