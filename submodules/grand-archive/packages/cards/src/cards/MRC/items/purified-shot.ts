import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purifiedShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dcgw05q66h",
  slug: "purified-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dcgw05q66h:face:default",
      catalogId: "dcgw05q66h",
      name: "Purified Shot",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
      },
      rulesText:
        "REST: Load Purified Shot into target unloaded Gun weapon you control.\n\n[Class Bonus] On Champion Hit: Banish up to X cards from that opponent’s graveyard, where X is the amount of damage dealt by this hit.",
      abilities: [
        {
          id: "dcgw05q66h-a1",
          kind: "activated",
          text: "REST: Load Purified Shot into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "dcgw05q66h-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Banish up to X cards from that opponent’s graveyard, where X is the amount of damage dealt by this hit.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "event-amount",
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
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
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
      ],
    },
  },
};

export default purifiedShot;
