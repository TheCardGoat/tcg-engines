import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfRain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3zb9p4lgdl",
  slug: "fractal-of-rain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3zb9p4lgdl:face:default",
      catalogId: "3zb9p4lgdl",
      name: "Fractal of Rain",
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
        "Imbue 2\n\nAt the beginning of your recollection phase, if Fractal of Rain is imbued, target player puts the top card of their deck into their graveyard.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "3zb9p4lgdl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "3zb9p4lgdl-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if Fractal of Rain is imbued, target player puts the top card of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "mill",
              player: {
                binding: "target-player",
              },
              amount: 1,
            },
          },
        },
        {
          id: "3zb9p4lgdl-a3",
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

export default fractalOfRain;
