import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hairpinOfTransience: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xl3tzqhlt1",
  slug: "hairpin-of-transience",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xl3tzqhlt1:face:default",
      catalogId: "xl3tzqhlt1",
      name: "Hairpin of Transience",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] Banish Hairpin of Transience: Put three wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
      abilities: [
        {
          id: "xl3tzqhlt1-a1",
          kind: "activated",
          text: "[Class Bonus] Banish Hairpin of Transience: Put three wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "wither",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default hairpinOfTransience;
