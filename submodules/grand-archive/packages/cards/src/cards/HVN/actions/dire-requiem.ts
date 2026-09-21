import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const direRequiem: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ek6gdmh8zh",
  slug: "dire-requiem",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ek6gdmh8zh:face:default",
      catalogId: "ek6gdmh8zh",
      name: "Dire Requiem",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Summon a Direwolf token.\n\n[Class Bonus] You may banish a fire element card from your graveyard. If you do, summon another Direwolf token. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "ek6gdmh8zh-a1",
          kind: "card-resolution",
          text: "Summon a Direwolf token.",
          effect: {
            kind: "summon",
            object: "Direwolf",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "ek6gdmh8zh-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may banish a fire element card from your graveyard. If you do, summon another Direwolf token. (Apply this effect only if your champion's class matches this card's class.)",
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
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
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
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "summon",
                    object: "Direwolf",
                    controller: "controller",
                    bindResultAs: "summoned-token",
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

export default direRequiem;
