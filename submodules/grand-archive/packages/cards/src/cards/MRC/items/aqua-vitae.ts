import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquaVitae: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y5ttkat9hr",
  slug: "aqua-vitae",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y5ttkat9hr:face:default",
      catalogId: "y5ttkat9hr",
      name: "Aqua Vitae",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Brew — One Springleaf\n\n[Class Bonus] At the beginning of your recollection phase, put an age counter on Aqua Vitae.\n\nSacrifice Aqua Vitae: Draw a card. Then if there were three or more age counters on Aqua Vitae, draw an additional card.",
      abilities: [
        {
          id: "y5ttkat9hr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Springleaf",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Springleaf",
                count: 1,
              },
            ],
          },
        },
        {
          id: "y5ttkat9hr-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, put an age counter on Aqua Vitae.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
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
              kind: "source",
            },
            counter: {
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "y5ttkat9hr-a3",
          kind: "activated",
          text: "Sacrifice Aqua Vitae: Draw a card. Then if there were three or more age counters on Aqua Vitae, draw an additional card.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "age",
                      },
                      basis: "last-known",
                      missing: "zero",
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default aquaVitae;
