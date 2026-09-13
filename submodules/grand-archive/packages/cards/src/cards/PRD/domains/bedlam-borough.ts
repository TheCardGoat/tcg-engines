import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bedlamBorough: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GXNyEp2Fju",
  slug: "bedlam-borough",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GXNyEp2Fju:face:default",
      catalogId: "GXNyEp2Fju",
      name: "Bedlam Borough",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "CROSSROADS"],
      },
      elements: ["NORM"],
      stats: {
        durability: 6,
      },
      rulesText:
        "(2), REST: Cascade—\n• 1, 2, and 3— Summon a Powercell token rested.\n• 4— Sacrifice Bedlam Borough and draw a card.",
      abilities: [
        {
          id: "GXNyEp2Fju-a1",
          kind: "activated",
          text: "(2), REST: Cascade—\n• 1, 2, and 3— Summon a Powercell token rested.\n• 4— Sacrifice Bedlam Borough and draw a card.",
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
                text: "Summon a Powercell token rested.",
                counts: [1, 2, 3],
                effect: {
                  kind: "summon",
                  object: "Powercell",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  entersWithStates: ["rested"],
                },
              },
              {
                id: "cascade-2",
                text: "Sacrifice Bedlam Borough and draw a card.",
                counts: [4],
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
                      kind: "draw",
                      player: "controller",
                      amount: 1,
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

export default bedlamBorough;
