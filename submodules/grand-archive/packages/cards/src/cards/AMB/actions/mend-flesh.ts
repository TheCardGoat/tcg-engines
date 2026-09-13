import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mendFlesh: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ju2d98w3j0",
  slug: "mend-flesh",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ju2d98w3j0:face:default",
      catalogId: "ju2d98w3j0",
      name: "Mend Flesh",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Damage 25+] This card costs 2 less to activate. (Apply this effect only if there are twenty-five or more damage counters on your champion.)\n\nRecover 8. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "ju2d98w3j0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Damage 25+] This card costs 2 less to activate. (Apply this effect only if there are twenty-five or more damage counters on your champion.)",
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 25,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ju2d98w3j0-a2",
          kind: "card-resolution",
          text: "Recover 8. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "recover",
            player: "controller",
            amount: 8,
          },
        },
      ],
    },
  },
};

export default mendFlesh;
