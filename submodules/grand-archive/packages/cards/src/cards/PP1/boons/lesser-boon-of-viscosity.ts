import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfViscosity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2LArvOxz5L",
  slug: "lesser-boon-of-viscosity",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "2LArvOxz5L:face:default",
      catalogId: "2LArvOxz5L",
      name: "Lesser Boon of Viscosity",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As you gain this boon, scavenge 10 for a Slime card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "2LArvOxz5L-a1",
          kind: "triggered",
          text: "As you gain this boon, scavenge 10 for a Slime card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 10,
            filter: {
              kind: "subtype",
              oneOf: ["SLIME"],
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfViscosity;
