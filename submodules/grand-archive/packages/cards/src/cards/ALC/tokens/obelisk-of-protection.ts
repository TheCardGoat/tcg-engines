import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obeliskOfProtection: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "d6soporhlq",
  slug: "obelisk-of-protection",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "d6soporhlq:face:default",
      catalogId: "d6soporhlq",
      name: "Obelisk of Protection",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "OBELISK"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "(4), REST: Prevent the next 2 damage that would be dealt to target unit this turn. This ability costs (1) less to activate for each domain you control.",
      abilities: [
        {
          id: "d6soporhlq-a1",
          kind: "activated",
          text: "(4), REST: Prevent the next 2 damage that would be dealt to target unit this turn. This ability costs (1) less to activate for each domain you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
            },
          ],
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default obeliskOfProtection;
