import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deepSeaFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hjdu50pces",
  slug: "deep-sea-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hjdu50pces:face:default",
      catalogId: "hjdu50pces",
      name: "Deep Sea Fractal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.) \n\nOn Enter: Each player puts the top card of their deck into their graveyard.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "hjdu50pces-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "hjdu50pces-a2",
          kind: "triggered",
          text: "On Enter: Each player puts the top card of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "mill",
            player: "each-player",
            amount: 1,
          },
        },
        {
          id: "hjdu50pces-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default deepSeaFractal;
