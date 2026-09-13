import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lycoria: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "89nl1vcn33",
  slug: "lycoria",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "89nl1vcn33:face:default",
      catalogId: "89nl1vcn33",
      name: "Lycoria",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, deal 1 unpreventable damage to your champion.",
      abilities: [
        {
          id: "89nl1vcn33-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, deal 1 unpreventable damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "champion",
              player: "controller",
            },
            amount: 1,
            preventable: false,
          },
        },
      ],
    },
  },
};

export default lycoria;
