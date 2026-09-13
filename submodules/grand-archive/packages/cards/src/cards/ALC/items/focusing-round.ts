import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const focusingRound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7yacwhzzfb",
  slug: "focusing-round",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7yacwhzzfb:face:default",
      catalogId: "7yacwhzzfb",
      name: "Focusing Round",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "On Enter: Draw a card.\n\n(2), REST: Load Focusing Round into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
      abilities: [
        {
          id: "7yacwhzzfb-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "7yacwhzzfb-a2",
          kind: "activated",
          text: "(2), REST: Load Focusing Round into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
      ],
    },
  },
};

export default focusingRound;
