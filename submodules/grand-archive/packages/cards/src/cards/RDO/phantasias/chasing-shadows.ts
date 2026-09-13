import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chasingShadows: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CyiA6N2geQ",
  slug: "chasing-shadows",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CyiA6N2geQ:face:default",
      catalogId: "CyiA6N2geQ",
      name: "Chasing Shadows",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "On Enter: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)\n\n[Tristan Bonus] Whenever you gain agility, allies you control named Ominous Shadow get +1POWER until end of turn.",
      abilities: [
        {
          id: "CyiA6N2geQ-a1",
          kind: "triggered",
          text: "On Enter: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "CyiA6N2geQ-a2",
          kind: "triggered",
          text: "[Tristan Bonus] Whenever you gain agility, allies you control named Ominous Shadow get +1POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "agility",
              to: true,
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
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "name",
                      value: "Ominous Shadow",
                    },
                  ],
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
        },
      ],
    },
  },
};

export default chasingShadows;
