import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enduraScepterOfIgnition: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SGsDKB9CN5",
  slug: "endura-scepter-of-ignition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SGsDKB9CN5:face:default",
      catalogId: "SGsDKB9CN5",
      name: "Endura, Scepter of Ignition",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SCEPTER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST, Remove an enlighten counter from your champion: Deal 1 damage to target unit. Activate this ability only at slow speed.",
      abilities: [
        {
          id: "SGsDKB9CN5-a1",
          kind: "activated",
          text: "REST, Remove an enlighten counter from your champion: Deal 1 damage to target unit. Activate this ability only at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
                amount: 1,
              },
            ],
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default enduraScepterOfIgnition;
