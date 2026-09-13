import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windstrikeSoldier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WFNM4etSFB",
  slug: "windstrike-soldier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WFNM4etSFB:face:default",
      catalogId: "WFNM4etSFB",
      name: "Windstrike Soldier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: You may pay (3). If you do, Windstrike Soldier gains multistrike 2 until end of turn. (You may assign up to two additional targets as you declare an attack with an ally with multistrike 2.)",
      abilities: [
        {
          id: "WFNM4etSFB-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may pay (3). If you do, Windstrike Soldier gains multistrike 2 until end of turn. (You may assign up to two additional targets as you declare an attack with an ally with multistrike 2.)",
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
              kind: "sequence",
              effects: [
                {
                  kind: "pay",
                  player: "controller",
                  cost: {
                    kind: "pay-reserve",
                    amount: 3,
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "multistrike",
                      value: 2,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default windstrikeSoldier;
