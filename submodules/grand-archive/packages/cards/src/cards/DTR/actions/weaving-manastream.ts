import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weavingManastream: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wi4f59furp",
  slug: "weaving-manastream",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wi4f59furp:face:default",
      catalogId: "wi4f59furp",
      name: "Weaving Manastream",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Your champion becomes distant.\n\n[Class Bonus] Floating Memory \n\n[Diana Bonus] [Element Bonus] Whenever this card is banished from your graveyard to pay for a memory cost, you may load it into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "wi4f59furp-a1",
          kind: "card-resolution",
          text: "Your champion becomes distant.",
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "champion",
              player: "controller",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "wi4f59furp-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
        },
        {
          id: "wi4f59furp-a3",
          kind: "triggered",
          text: "[Diana Bonus] [Element Bonus] Whenever this card is banished from your graveyard to pay for a memory cost, you may load it into an Aetherwing weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "graveyard",
              payment: {
                costKind: "memory",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "aetherwing-weapon",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                from: "banishment",
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "aetherwing-weapon",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default weavingManastream;
