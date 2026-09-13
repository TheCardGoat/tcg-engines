import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const foundPower: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8pIXnuI1Df",
  slug: "found-power",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8pIXnuI1Df:face:default",
      catalogId: "8pIXnuI1Df",
      name: "Found Power",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Empower 3. If you control an object named Proto Key Crest, discard up to two cards, then draw that many cards.",
      abilities: [
        {
          id: "8pIXnuI1Df-a1",
          kind: "card-resolution",
          text: "Empower 3. If you control an object named Proto Key Crest, discard up to two cards, then draw that many cards.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                amount: 3,
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "conditional",
                    condition: {
                      kind: "collection-exists",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "name",
                              value: "Proto Key Crest",
                              match: "exact",
                            },
                            {
                              kind: "subtype",
                              oneOf: ["CREST"],
                            },
                          ],
                        },
                      },
                    },
                    then: {
                      kind: "discard",
                      player: "controller",
                      selection: {
                        id: "discarded-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "up-to",
                          amount: 2,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["hand"],
                          relationship: "zone-of",
                          player: "controller",
                        },
                      },
                    },
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: {
                      kind: "modified-ability-result-amount",
                      metric: "cards-moved",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default foundPower;
