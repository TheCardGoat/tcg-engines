import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grimForeboding: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4hnf1yyx1q",
  slug: "grim-foreboding",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4hnf1yyx1q:face:default",
      catalogId: "4hnf1yyx1q",
      name: "Grim Foreboding",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Tristan Bonus] Summon an Ominous Shadow token.\n\nPhantasia allies you control get +1 POWER until end of turn. You gain agility 3 for this turn.",
      abilities: [
        {
          id: "4hnf1yyx1q-a1",
          kind: "card-resolution",
          text: "[Tristan Bonus] Summon an Ominous Shadow token.",
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
            kind: "summon",
            object: "Ominous Shadow",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "4hnf1yyx1q-a2",
          kind: "card-resolution",
          text: "Phantasia allies you control get +1 POWER until end of turn. You gain agility 3 for this turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["PHANTASIA"],
                    },
                  },
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: "agility",
                value: true,
                amount: 3,
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default grimForeboding;
