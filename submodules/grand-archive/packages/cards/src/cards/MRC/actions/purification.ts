import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purification: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k8ao8bki6f",
  slug: "purification",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k8ao8bki6f:face:default",
      catalogId: "k8ao8bki6f",
      name: "Purification",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Recover 2. Then choose up to two Curse cards from your champion’s lineage and discard them. For each card discarded this way, recover 2.",
      abilities: [
        {
          id: "k8ao8bki6f-a1",
          kind: "card-resolution",
          text: "Recover 2. Then choose up to two Curse cards from your champion’s lineage and discard them. For each card discarded this way, recover 2.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "lineage-curses",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["inner-lineage"],
                    host: {
                      kind: "champion",
                      player: "controller",
                    },
                    relationship: "lineage-of",
                    filter: {
                      kind: "subtype",
                      oneOf: ["CURSE"],
                    },
                  },
                },
                bindResultAs: "discarded-curses",
              },
              {
                kind: "repeat",
                count: {
                  kind: "modified-ability-result-amount",
                  metric: "cards-moved",
                },
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default purification;
