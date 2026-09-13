import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revitalizerXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GKeIgWKSUi",
  slug: "revitalizer-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GKeIgWKSUi:face:default",
      catalogId: "GKeIgWKSUi",
      name: "Revitalizer X Ultra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "VELTECH", "SOLVENT"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "REST: Cascade— \n• 1— Recover 1.\n• 2— Recover 2.\n• 3— Sacrifice Revitalizer X Ultra, recover 3, and draw a card into your memory. \n(This ability changes each cascade.)",
      abilities: [
        {
          id: "GKeIgWKSUi-a1",
          kind: "activated",
          text: "REST: Cascade—\n• 1— Recover 1.\n• 2— Recover 2.\n• 3— Sacrifice Revitalizer X Ultra, recover 3, and draw a card into your memory.\n(This ability changes each cascade.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "activation",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Recover 1.",
                counts: [1],
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                id: "cascade-2",
                text: "Recover 2.",
                counts: [2],
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              },
              {
                id: "cascade-3",
                text: "Sacrifice Revitalizer X Ultra, recover 3, and draw a card into your memory.",
                counts: [3],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "sacrifice",
                      subject: {
                        kind: "source",
                      },
                    },
                    {
                      kind: "recover",
                      player: "controller",
                      amount: 3,
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                      to: "memory",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default revitalizerXUltra;
