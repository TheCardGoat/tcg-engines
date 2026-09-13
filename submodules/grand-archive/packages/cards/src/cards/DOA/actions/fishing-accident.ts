import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fishingAccident: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RRx0KK6g6D",
  slug: "fishing-accident",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RRx0KK6g6D:face:default",
      catalogId: "RRx0KK6g6D",
      name: "Fishing Accident",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prepare 2 (You may remove two preparation counters from your champion as you activate this card.)\n\nRest target ally. If Fishing Accident was prepared, put that ally on the bottom of its owner's deck instead.",
      abilities: [
        {
          id: "RRx0KK6g6D-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2 (You may remove two preparation counters from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 2,
          },
        },
        {
          id: "RRx0KK6g6D-a2",
          kind: "card-resolution",
          text: "Rest target ally. If Fishing Accident was prepared, put that ally on the bottom of its owner's deck instead.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              destination: {
                zone: "main-deck",
                placement: {
                  kind: "bottom",
                },
              },
            },
            else: {
              kind: "rest",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
          },
        },
      ],
    },
  },
};

export default fishingAccident;
