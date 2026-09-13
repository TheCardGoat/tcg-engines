import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireSniper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6hjlgx72rf",
  slug: "gloamspire-sniper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6hjlgx72rf:face:default",
      catalogId: "6hjlgx72rf",
      name: "Gloamspire Sniper",
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
        power: 2,
        life: 3,
      },
      rulesText:
        "Ranged 4, True Sight\n\n[Class Bonus] On Kill: Generate a Creeping Torment card and put it on the bottom of target champion’s lineage. (To generate, add that card from outside of the game.) ",
      abilities: [
        {
          id: "6hjlgx72rf-a1",
          kind: "keyword-group",
          text: "Ranged 4, True Sight",
          keywords: [
            {
              name: "ranged",
              value: 4,
            },
            {
              name: "true-sight",
            },
          ],
        },
        {
          id: "6hjlgx72rf-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: Generate a Creeping Torment card and put it on the bottom of target champion’s lineage. (To generate, add that card from outside of the game.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-champion",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
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
            kind: "generate",
            card: "Creeping Torment",
            player: "controller",
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "bound",
                binding: "target-champion",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
      ],
    },
  },
};

export default gloamspireSniper;
