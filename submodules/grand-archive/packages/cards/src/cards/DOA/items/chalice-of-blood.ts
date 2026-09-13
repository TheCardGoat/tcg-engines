import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chaliceOfBlood: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UiohpiTtgs",
  slug: "chalice-of-blood",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UiohpiTtgs:face:default",
      catalogId: "UiohpiTtgs",
      name: "Chalice of Blood",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Chalice of Blood: Draw two cards. Activate this ability only if your champion has twenty or more damage counters on them.",
      abilities: [
        {
          id: "UiohpiTtgs-a1",
          kind: "activated",
          text: "Banish Chalice of Blood: Draw two cards. Activate this ability only if your champion has twenty or more damage counters on them.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
              },
              operator: "gte",
              right: 20,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default chaliceOfBlood;
