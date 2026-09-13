import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const danteAeneanInitiate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "84YTQPTvar",
  slug: "dante-aenean-initiate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "84YTQPTvar:face:default",
      catalogId: "84YTQPTvar",
      name: "Dante, Aenean Initiate",
      lineageName: "Dante",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Dante Lineage\n\nOn Enter: Scavenge 10 for an Aenean Spell card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "84YTQPTvar-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Dante Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Dante",
          },
        },
        {
          id: "84YTQPTvar-a2",
          kind: "triggered",
          text: "On Enter: Scavenge 10 for an Aenean Spell card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
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
            kind: "keyword-action",
            action: "scavenge",
            amount: 10,
            filter: {
              kind: "subtype",
              oneOf: ["SPELL"],
            },
          },
        },
      ],
    },
  },
};

export default danteAeneanInitiate;
