import { describe, expect, it } from "vite-plus/test";
import type { FilteredMatchView } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import {
  applyGundamPresentationToView,
  filterGundamCardsMapsForView,
  readGundamPresentation,
  resolveGundamPresentationPrintingId,
} from "./gundam-presentation.js";

function makeCard(): Card {
  return {
    name: "Test Unit",
    cost: 3,
    level: 2,
    type: "unit",
    cardNumber: "ST01-001",
    rarity: "rare",
    traits: [],
    keywordEffects: [],
    printings: [
      {
        id: "ST01-001",
        artId: "ST01-001",
        imageUrl: "https://cdn.example/ST01-001.webp",
      },
      {
        id: "ST01-001_p1",
        artId: "ST01-001_p1",
        imageUrl: "https://cdn.example/ST01-001_p1.webp",
      },
    ],
    selectedPrintingId: "ST01-001",
  } as Card;
}

function makeView(
  cards: FilteredMatchView["zones"]["zones"][string]["cards"],
  hiddenCards: FilteredMatchView["zones"]["zones"][string]["cards"] = [],
): FilteredMatchView {
  return {
    G: {},
    stateID: 1,
    status: { turn: 1, activePlayer: "p1", gameEnded: false, pendingDecision: [] },
    zones: {
      zones: {
        "battleArea:p1": { count: cards.length, cards },
        // The engine's filtered view emits every zone, including zones owned
        // by other players: hidden cards keep their instanceId but lose their
        // definition.
        "deck:p2": {
          count: hiddenCards.length,
          cards: hiddenCards.map((card) => ({
            ...card,
            definition: null,
            definitionId: null,
            faceDown: true,
            zoneId: "deck:p2",
          })),
        },
      },
    },
    players: [{ playerId: "p1", publicData: {} }],
    availableMoves: [],
    myPlayerId: "p1",
    timerView: { serverTimestamp: 0 },
  } as FilteredMatchView;
}

describe("readGundamPresentation", () => {
  it("reads reminted presentation from match resources.cardsMaps", () => {
    expect(
      readGundamPresentation({
        cardsMaps: {
          cardInstances: {},
          owners: {},
          presentation: {
            printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" },
            printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
          },
        },
      }),
    ).toEqual({
      printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" },
      printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
    });
  });

  it("unwraps persisted player/spectator/replay resource bags", () => {
    expect(
      readGundamPresentation({
        players: {
          p1: {
            cardsMaps: {
              presentation: {
                printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" },
              },
            },
          },
        },
      }),
    ).toEqual({
      printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" },
    });
  });
});

describe("resolveGundamPresentationPrintingId", () => {
  const presentation = {
    printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" },
    printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
  };

  it("prefers the reminted instance map", () => {
    expect(resolveGundamPresentationPrintingId(presentation, "p1_deck_ST01-001_0", "p1")).toBe(
      "ST01-001_p1",
    );
  });

  it("maps setup token instance ids onto host slot printings", () => {
    expect(resolveGundamPresentationPrintingId(presentation, "ex-base-token:p1")).toBe(
      "EXBP-001_p1",
    );
  });
});

describe("applyGundamPresentationToView", () => {
  it("stamps mixed printings onto visible cards and leaves hidden cards untouched", () => {
    const def = makeCard();
    const view = makeView([
      {
        instanceId: "p1_deck_ST01-001_0",
        definition: def,
        definitionId: "ST01-001",
        meta: null,
        ownerId: "p1",
        controllerId: "p1",
        faceDown: false,
        zoneId: "battleArea:p1",
      },
      {
        instanceId: "p1_deck_ST01-001_1",
        definition: def,
        definitionId: "ST01-001",
        meta: null,
        ownerId: "p1",
        controllerId: "p1",
        faceDown: false,
        zoneId: "battleArea:p1",
      },
      {
        instanceId: "hidden-1",
        definition: null,
        definitionId: null,
        meta: null,
        ownerId: "p1",
        controllerId: "p1",
        faceDown: true,
        zoneId: "hand:p1",
      },
    ]);

    const projected = applyGundamPresentationToView(view, {
      printingIdByInstanceId: {
        "p1_deck_ST01-001_0": "ST01-001_p1",
        "p1_deck_ST01-001_1": "ST01-001",
      },
    });

    const cards = projected.zones.zones["battleArea:p1"]?.cards ?? [];
    expect(cards[0]?.definition?.selectedPrintingId).toBe("ST01-001_p1");
    expect(cards[1]?.definition?.selectedPrintingId).toBe("ST01-001");
    expect(cards[2]?.definition).toBeNull();
    expect(cards[0]?.definition).not.toBe(def);
  });

  it("applies setup-slot printings to host token instance ids", () => {
    const def = makeCard();
    const view = makeView([
      {
        instanceId: "ex-base-token:p1",
        definition: def,
        definitionId: "EXBP-001",
        meta: { isToken: true },
        ownerId: "p1",
        controllerId: "p1",
        faceDown: false,
        zoneId: "baseSection:p1",
      },
    ]);

    const projected = applyGundamPresentationToView(view, {
      printingIdByInstanceId: {},
      printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
    });

    expect(projected.zones.zones["battleArea:p1"]?.cards[0]?.definition?.selectedPrintingId).toBe(
      "EXBP-001_p1",
    );
  });
});

describe("filterGundamCardsMapsForView", () => {
  function viewCard(instanceId: string) {
    return {
      instanceId,
      definition: makeCard(),
      definitionId: "ST01-001",
      meta: null,
      ownerId: "p1",
      controllerId: "p1",
      faceDown: false,
      zoneId: "battleArea:p1",
    };
  }

  it("exposes only instances the viewer's projection already reveals", () => {
    const view = makeView([viewCard("p1_deck_ST01-001_0")]);

    const filtered = filterGundamCardsMapsForView(
      {
        cardInstances: {
          "p1_deck_ST01-001_0": "ST01-001",
          "p2_deck_ST01-001_0": "ST01-001",
        },
        owners: {
          p1: ["p1_deck_ST01-001_0", "p1_deck_ST01-001_1"],
          p2: ["p2_deck_ST01-001_0"],
        },
        instanceSections: {
          "p1_deck_ST01-001_0": "main",
          "p2_deck_ST01-001_0": "main",
        },
        presentation: {
          printingIdByInstanceId: {
            "p1_deck_ST01-001_0": "ST01-001_p1",
            "p2_deck_ST01-001_0": "ST01-001_p2",
          },
        },
      },
      view,
    );

    expect(filtered).toEqual({
      cardInstances: { "p1_deck_ST01-001_0": "ST01-001" },
      owners: { p1: ["p1_deck_ST01-001_0"] },
      instanceSections: { "p1_deck_ST01-001_0": "main" },
      presentation: { printingIdByInstanceId: { "p1_deck_ST01-001_0": "ST01-001_p1" } },
    });
  });

  it("drops hidden-zone cards from every map even though their instanceIds are present", () => {
    // Hidden cards keep `instanceId` in the filtered view, so zone membership
    // must not count as visibility.
    const view = makeView(
      [viewCard("p1_deck_ST01-001_0")],
      [
        {
          instanceId: "p2_deck_ST01-001_0",
          definition: null,
          definitionId: null,
          meta: null,
          ownerId: "p2",
          controllerId: "p2",
          faceDown: true,
          zoneId: "deck:p2",
        },
      ],
    );

    const filtered = filterGundamCardsMapsForView(
      {
        cardInstances: {
          "p1_deck_ST01-001_0": "ST01-001",
          "p2_deck_ST01-001_0": "ST01-001",
        },
        owners: { p2: ["p2_deck_ST01-001_0"] },
        instanceSections: { "p2_deck_ST01-001_0": "main" },
        presentation: {
          printingIdByInstanceId: { "p2_deck_ST01-001_0": "ST01-001_p2" },
        },
      },
      view,
    );

    expect(filtered).toEqual({
      cardInstances: { "p1_deck_ST01-001_0": "ST01-001" },
      owners: {},
      instanceSections: {},
      presentation: { printingIdByInstanceId: {} },
    });
  });

  it("keeps an owner's setup-slot printings only once their token is placed", () => {
    const withTokens = makeView([viewCard("ex-base-token:p1"), viewCard("ex-resource-token:p2")]);

    const slots = {
      p1: { "ex-base": "EXBP-002", "ex-resource": "EXRP-005" },
      p2: { "ex-base": "EXBP-001", "ex-resource": "EXRP-003" },
    };

    const beforePlacement = filterGundamCardsMapsForView(
      {
        cardInstances: {},
        owners: {},
        presentation: { printingIdByInstanceId: {}, printingIdBySetupSlotByOwnerId: slots },
      },
      makeView([]),
    );
    expect(beforePlacement).toEqual({ cardInstances: {}, owners: {} });

    const afterPlacement = filterGundamCardsMapsForView(
      {
        cardInstances: {},
        owners: {},
        presentation: { printingIdByInstanceId: {}, printingIdBySetupSlotByOwnerId: slots },
      },
      withTokens,
    );
    // p1's base token and p2's resource token are placed (public); the
    // unplaced slots stay hidden.
    expect(afterPlacement.presentation?.printingIdBySetupSlotByOwnerId).toEqual({
      p1: { "ex-base": "EXBP-002" },
      p2: { "ex-resource": "EXRP-003" },
    });
  });
});
