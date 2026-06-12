import { describe, expect, it } from "bun:test";
import type { MatchStaticResources } from "@tcg/lorcana-engine";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";

import { buildCardSnapshotMap, mergeSupplementalScryCardSnapshots } from "./board-utils.js";
import type { LorcanaCardSnapshot } from "./contracts.js";

describe("mergeSupplementalScryCardSnapshots", () => {
  it("adds snapshots for revealed scry cards hidden by board projection", () => {
    const board = {
      stateID: 42,
      cards: {},
      players: {
        player_one: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 4,
        },
        player_two: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
      },
      playerOrder: ["player_one", "player_two"],
      pendingEffects: [
        {
          id: "pending-scry-1",
          selectionContext: {
            kind: "scry-selection",
            revealedCardIds: ["reveal-1"],
          },
        },
      ],
      bagEffects: [],
    } as unknown as LorcanaProjectedBoardView;

    const staticResources = {
      instances: new Map([
        [
          "reveal-1",
          {
            instanceId: "reveal-1",
            definitionId: "001-001",
            ownerID: "player_one",
          },
        ],
      ]),
      cards: new Map([
        [
          "001-001",
          {
            id: "001-001",
            name: "Reflection",
            cardNumber: "65",
            set: "TFC",
            cardType: "action",
            actionSubtype: "song",
            cost: 1,
            inkType: ["amber"],
            inkable: true,
            rarity: "common",
            text: "Look at the top 3 cards of your deck.",
          },
        ],
      ]),
    } as unknown as MatchStaticResources;

    const snapshots: Record<string, LorcanaCardSnapshot> = {};

    const merged = mergeSupplementalScryCardSnapshots({
      board,
      snapshots,
      staticResources,
      authoritativeState: {
        ctx: {
          zones: {
            private: {
              cardIndex: {
                "reveal-1": {
                  zoneKey: "deck:player_one",
                  ownerID: "player_one",
                  controllerID: "player_one",
                },
              },
              cardMeta: {
                "reveal-1": {},
              },
            },
          },
        },
      },
    });

    expect(merged["reveal-1"]).toMatchObject({
      cardId: "reveal-1",
      definitionId: "001-001",
      label: "Reflection",
      ownerId: "player_one",
      ownerSide: "playerOne",
      zoneId: "deck",
      cost: 1,
      playCost: 1,
      isMasked: false,
      facePresentation: "faceUp",
      set: "TFC",
      cardNumber: "65",
    });
  });

  it("surfaces Bodyguard keyword and may-enter-play-exerted option for scry-revealed cards (PR #73 review feedback)", () => {
    const board = {
      stateID: 42,
      cards: {},
      players: {
        player_one: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 4,
        },
        player_two: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
      },
      playerOrder: ["player_one", "player_two"],
      pendingEffects: [
        {
          id: "pending-scry-1",
          selectionContext: {
            kind: "scry-selection",
            revealedCardIds: ["reveal-bg", "reveal-may"],
          },
        },
      ],
      bagEffects: [],
    } as unknown as LorcanaProjectedBoardView;

    const staticResources = {
      instances: new Map([
        [
          "reveal-bg",
          {
            instanceId: "reveal-bg",
            definitionId: "BG-001",
            ownerID: "player_one",
          },
        ],
        [
          "reveal-may",
          {
            instanceId: "reveal-may",
            definitionId: "MAY-001",
            ownerID: "player_one",
          },
        ],
      ]),
      cards: new Map([
        [
          "BG-001",
          {
            id: "BG-001",
            name: "Bodyguard Char",
            cardType: "character",
            cost: 4,
            willpower: 5,
            strength: 2,
            inkable: true,
            abilities: [{ type: "keyword", keyword: "Bodyguard" }],
          },
        ],
        [
          "MAY-001",
          {
            id: "MAY-001",
            name: "May-Enter-Exerted Char",
            cardType: "character",
            cost: 4,
            willpower: 5,
            strength: 2,
            inkable: true,
            abilities: [
              {
                id: "may-1",
                name: "LONG JOURNEY",
                type: "static",
                text: "This character may enter play exerted.",
                effect: {
                  type: "restriction",
                  restriction: "may-enter-play-exerted",
                  target: "SELF",
                },
              },
            ],
          },
        ],
      ]),
    } as unknown as MatchStaticResources;

    const merged = mergeSupplementalScryCardSnapshots({
      board,
      snapshots: {},
      staticResources,
      authoritativeState: {
        ctx: {
          zones: {
            private: {
              cardIndex: {
                "reveal-bg": {
                  zoneKey: "deck:player_one",
                  ownerID: "player_one",
                  controllerID: "player_one",
                },
                "reveal-may": {
                  zoneKey: "deck:player_one",
                  ownerID: "player_one",
                  controllerID: "player_one",
                },
              },
              cardMeta: {
                "reveal-bg": {},
                "reveal-may": {},
              },
            },
          },
        },
      },
    });

    expect(merged["reveal-bg"]?.keywords).toEqual(["Bodyguard"]);
    expect(merged["reveal-bg"]?.mayEnterPlayExertedOption).toBeUndefined();
    expect(merged["reveal-may"]?.keywords).toEqual([]);
    expect(merged["reveal-may"]?.mayEnterPlayExertedOption).toBe(true);
  });
});

describe("buildCardSnapshotMap", () => {
  it("threads shift cost metadata into simulator card snapshots", () => {
    const board = {
      stateID: 7,
      cards: {
        "shift-1": {
          id: "shift-1",
          ownerId: "player_one",
          zone: "hand",
          definitionId: "001-173",
          playCost: 6,
          shiftInkCost: 4,
          shiftPlayCost: 3,
          keywords: ["Shift"],
        },
      },
      players: {
        player_one: {
          hand: ["shift-1"],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
        player_two: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
      },
      playerOrder: ["player_one", "player_two"],
      pendingEffects: [],
      bagEffects: [],
    } as unknown as LorcanaProjectedBoardView;

    const staticResources = {
      instances: new Map([
        [
          "shift-1",
          {
            instanceId: "shift-1",
            definitionId: "001-173",
            ownerID: "player_one",
          },
        ],
      ]),
      cards: new Map([
        [
          "001-173",
          {
            id: "001-173",
            name: "Stitch",
            version: "Rock Star",
            cardNumber: 173,
            set: "001",
            cardType: "character",
            cost: 6,
            inkType: ["amber"],
            inkable: true,
            rarity: "super_rare",
            strength: 3,
            willpower: 5,
            lore: 3,
            classifications: ["Floodborn", "Hero", "Alien"],
            text: "Shift 4",
          },
        ],
      ]),
    } as unknown as MatchStaticResources;

    const snapshots = buildCardSnapshotMap(board, staticResources);

    expect(snapshots["shift-1"]).toMatchObject({
      cardId: "shift-1",
      cost: 6,
      playCost: 6,
      shiftInkCost: 4,
      shiftPlayCost: 3,
      zoneId: "hand",
      ownerSide: "playerOne",
    });
  });

  it("threads discounted projected play cost into simulator card snapshots", () => {
    const board = {
      stateID: 8,
      cards: {
        "discount-1": {
          id: "discount-1",
          ownerId: "player_one",
          zone: "hand",
          definitionId: "001-050",
          playCost: 3,
        },
      },
      players: {
        player_one: {
          hand: ["discount-1"],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
        player_two: {
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
          deckCount: 0,
        },
      },
      playerOrder: ["player_one", "player_two"],
      pendingEffects: [],
      bagEffects: [],
    } as unknown as LorcanaProjectedBoardView;

    const staticResources = {
      instances: new Map([
        [
          "discount-1",
          {
            instanceId: "discount-1",
            definitionId: "001-050",
            ownerID: "player_one",
          },
        ],
      ]),
      cards: new Map([
        [
          "001-050",
          {
            id: "001-050",
            name: "Lantern Bearer",
            cardNumber: 50,
            set: "001",
            cardType: "character",
            cost: 4,
            inkType: ["amber"],
            inkable: true,
            rarity: "common",
            strength: 2,
            willpower: 2,
            lore: 1,
            classifications: ["Dreamborn"],
            text: "",
          },
        ],
      ]),
    } as unknown as MatchStaticResources;

    const snapshots = buildCardSnapshotMap(board, staticResources);

    expect(snapshots["discount-1"]).toMatchObject({
      cardId: "discount-1",
      cost: 4,
      playCost: 3,
      zoneId: "hand",
      ownerSide: "playerOne",
    });
  });

  describe("textEntries projection from plain string text", () => {
    function makeBoard(cardId: string, definitionId: string): LorcanaProjectedBoardView {
      return {
        stateID: 99,
        cards: {
          [cardId]: {
            id: cardId,
            ownerId: "player_one",
            zone: "hand",
            definitionId,
          },
        },
        players: {
          player_one: {
            hand: [cardId],
            play: [],
            inkwell: [],
            discard: [],
            deckCount: 0,
          },
          player_two: {
            hand: [],
            play: [],
            inkwell: [],
            discard: [],
            deckCount: 0,
          },
        },
        playerOrder: ["player_one", "player_two"],
        pendingEffects: [],
        bagEffects: [],
      } as unknown as LorcanaProjectedBoardView;
    }

    function makeStaticResources(
      instanceId: string,
      definitionId: string,
      cardDefinition: object,
    ): MatchStaticResources {
      return {
        instances: new Map([
          [
            instanceId,
            {
              instanceId,
              definitionId,
              ownerID: "player_one",
            },
          ],
        ]),
        cards: new Map([[definitionId, { id: definitionId, ...cardDefinition }]]),
      } as unknown as MatchStaticResources;
    }

    it("produces a single textEntry for a plain string keyword (e.g. 'Support')", () => {
      const board = makeBoard("card-1", "def-1");
      const staticResources = makeStaticResources("card-1", "def-1", {
        name: "Tiana",
        cardNumber: 5,
        set: "011",
        cardType: "character",
        cost: 3,
        inkType: ["amber"],
        inkable: true,
        rarity: "common",
        strength: 2,
        willpower: 3,
        lore: 1,
        classifications: ["Storyborn"],
        text: "Support",
      });

      const snapshots = buildCardSnapshotMap(board, staticResources);
      expect(snapshots["card-1"].textEntries).toEqual([{ title: "Support" }]);
    });

    it("produces a textEntry for a plain string with 'Boost N {I}' so the Boost button can render", () => {
      const board = makeBoard("card-2", "def-2");
      const staticResources = makeStaticResources("card-2", "def-2", {
        name: "Genie",
        version: "Magical Researcher",
        cardNumber: 49,
        set: "011",
        cardType: "character",
        cost: 3,
        inkType: ["amethyst"],
        inkable: true,
        rarity: "rare",
        strength: 3,
        willpower: 4,
        lore: 1,
        classifications: ["Storyborn"],
        text: "Boost 1 {I} INCREASING WISDOM This character gets +1 {L} for each card under him.",
      });

      const snapshots = buildCardSnapshotMap(board, staticResources);
      expect(snapshots["card-2"].textEntries).toBeDefined();
      expect(snapshots["card-2"].textEntries!.length).toBeGreaterThan(0);
    });

    it("splits a multiline plain string into separate textEntries", () => {
      const board = makeBoard("card-3", "def-3");
      const staticResources = makeStaticResources("card-3", "def-3", {
        name: "Test Card",
        cardNumber: 1,
        set: "001",
        cardType: "character",
        cost: 2,
        inkType: ["amber"],
        inkable: true,
        rarity: "common",
        strength: 2,
        willpower: 2,
        lore: 1,
        classifications: ["Storyborn"],
        text: "Boost 1 {I}\nMY ABILITY Do something cool.",
      });

      const snapshots = buildCardSnapshotMap(board, staticResources);
      expect(snapshots["card-3"].textEntries).toEqual([
        { title: "Boost 1 {I}" },
        { title: "MY ABILITY Do something cool." },
      ]);
    });

    it("returns undefined textEntries for an empty plain string", () => {
      const board = makeBoard("card-4", "def-4");
      const staticResources = makeStaticResources("card-4", "def-4", {
        name: "No Text Card",
        cardNumber: 2,
        set: "001",
        cardType: "character",
        cost: 2,
        inkType: ["amber"],
        inkable: true,
        rarity: "common",
        strength: 2,
        willpower: 2,
        lore: 1,
        classifications: ["Storyborn"],
        text: "",
      });

      const snapshots = buildCardSnapshotMap(board, staticResources);
      expect(snapshots["card-4"].textEntries).toBeUndefined();
    });
  });
});
