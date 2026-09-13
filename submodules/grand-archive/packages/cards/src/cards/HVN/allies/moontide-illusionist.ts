import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moontideIllusionist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "flzvpkc0ni",
  slug: "moontide-illusionist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "flzvpkc0ni:face:default",
      catalogId: "flzvpkc0ni",
      name: "Moontide Illusionist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are water element, this card becomes imbued.)\n\nIntercept\n\nOn Death: If Moontide Illusionist was imbued, put the top two cards of your deck into your graveyard.",
      abilities: [
        {
          id: "flzvpkc0ni-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are water element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "flzvpkc0ni-a2",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "flzvpkc0ni-a3",
          kind: "triggered",
          text: "On Death: If Moontide Illusionist was imbued, put the top two cards of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
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

export default moontideIllusionist;
