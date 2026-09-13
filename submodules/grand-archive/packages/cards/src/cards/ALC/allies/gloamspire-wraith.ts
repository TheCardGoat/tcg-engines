import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireWraith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xrpx8jypwc",
  slug: "gloamspire-wraith",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xrpx8jypwc:face:default",
      catalogId: "xrpx8jypwc",
      name: "Gloamspire Wraith",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        '[Class Bonus] Ranged 2\n\nAs long as Gloamspire Wraith is distant, it has "On Hit: Recover X, where X is the amount of damage dealt by this hit." (To recover, remove that many damage counters from your champion.)',
      abilities: [
        {
          id: "xrpx8jypwc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
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
          id: "xrpx8jypwc-a2",
          kind: "static",
          staticKind: "effects",
          text: 'As long as Gloamspire Wraith is distant, it has "On Hit: Recover X, where X is the amount of damage dealt by this hit." (To recover, remove that many damage counters from your champion.)',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "distant",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-zjtwd7-a1",
                  kind: "triggered",
                  text: "On Hit: Recover X, where X is the amount of damage dealt by this hit.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-hit",
                      subject: {
                        kind: "source",
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
                  effect: {
                    kind: "recover",
                    player: "controller",
                    amount: {
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default gloamspireWraith;
