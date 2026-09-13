import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisedBowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wkz77mbyj0",
  slug: "poised-bowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wkz77mbyj0:face:default",
      catalogId: "wkz77mbyj0",
      name: "Poised Bowman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)\n\nOn Enter: Poised Bowman gains vigor until end of turn. (At the beginning of the end phase, wake up this ally with vigor.)",
      abilities: [
        {
          id: "wkz77mbyj0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "wkz77mbyj0-a2",
          kind: "triggered",
          text: "On Enter: Poised Bowman gains vigor until end of turn. (At the beginning of the end phase, wake up this ally with vigor.)",
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "vigor",
              },
            },
          },
        },
      ],
    },
  },
};

export default poisedBowman;
