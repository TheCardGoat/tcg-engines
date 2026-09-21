import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireMantle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fooz13xfpk",
  slug: "gloamspire-mantle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fooz13xfpk:face:default",
      catalogId: "fooz13xfpk",
      name: "Gloamspire Mantle",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "[Tristan Bonus] On Enter: You may pay (3). If you do, summon an Ominous Shadow token.\n\nUmbra element phantasia allies you control have ambush. (They may retaliate against attackers while not defending.)",
      abilities: [
        {
          id: "fooz13xfpk-a1",
          kind: "triggered",
          text: "[Tristan Bonus] On Enter: You may pay (3). If you do, summon an Ominous Shadow token.",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
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
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 3,
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
                    object: "Ominous Shadow",
                    controller: "controller",
                    bindResultAs: "summoned-token",
                  },
                },
              ],
            },
          },
        },
        {
          id: "fooz13xfpk-a2",
          kind: "static",
          staticKind: "effects",
          text: "Umbra element phantasia allies you control have ambush. (They may retaliate against attackers while not defending.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["UMBRA"],
                      },
                      {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ambush",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default gloamspireMantle;
