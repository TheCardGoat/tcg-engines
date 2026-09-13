import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nrow8iopvc",
  slug: "imperial-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nrow8iopvc:face:default",
      catalogId: "nrow8iopvc",
      name: "Imperial Scout",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.) \n\nWhenever Imperial Scout becomes distant, you may put the top two cards of your deck into your graveyard.",
      abilities: [
        {
          id: "nrow8iopvc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "nrow8iopvc-a2",
          kind: "triggered",
          text: "Whenever Imperial Scout becomes distant, you may put the top two cards of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "distant",
              to: true,
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "mill",
              player: "controller",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default imperialScout;
