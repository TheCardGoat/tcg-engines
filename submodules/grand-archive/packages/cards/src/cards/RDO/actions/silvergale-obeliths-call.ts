import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const silvergaleObelithsCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZENwsneT5Y",
  slug: "silvergale-obeliths-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZENwsneT5Y:face:default",
      catalogId: "ZENwsneT5Y",
      name: "Silvergale Obelith's Call",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText: "Summon a Memorite Obelith token with a sheen counter on it.",
      abilities: [
        {
          id: "ZENwsneT5Y-a1",
          kind: "card-resolution",
          text: "Summon a Memorite Obelith token with a sheen counter on it.",
          effect: {
            kind: "summon",
            object: "Memorite Obelith",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithCounters: [
              {
                counter: {
                  named: "sheen",
                },
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default silvergaleObelithsCall;
