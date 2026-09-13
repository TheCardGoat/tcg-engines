import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automatonBeastkeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i5jnsl7ddc",
  slug: "automaton-beastkeeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i5jnsl7ddc:face:default",
      catalogId: "i5jnsl7ddc",
      name: "Automaton Beastkeeper",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Enter: You may return a Beast ally card from your graveyard to your memory.",
      abilities: [
        {
          id: "i5jnsl7ddc-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may return a Beast ally card from your graveyard to your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "returned-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "returned-card",
                },
                from: "graveyard",
                destination: {
                  zone: "memory",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default automatonBeastkeeper;
