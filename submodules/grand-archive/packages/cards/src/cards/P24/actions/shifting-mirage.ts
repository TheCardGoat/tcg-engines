import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shiftingMirage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hmjr33ijq6",
  slug: "shifting-mirage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hmjr33ijq6:face:default",
      catalogId: "hmjr33ijq6",
      name: "Shifting Mirage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nYour champion gains stealth until end of turn unless an opponent pays (2).\n\n[Tristan Bonus] Summon an Ominous Shadow token.",
      abilities: [
        {
          id: "hmjr33ijq6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "hmjr33ijq6-a2",
          kind: "card-resolution",
          text: "Your champion gains stealth until end of turn unless an opponent pays (2).",
          effect: {
            kind: "unless-paid",
            player: "any-opponent-in-turn-order",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            otherwise: {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                  name: "stealth",
                },
              },
            },
          },
        },
        {
          id: "hmjr33ijq6-a3",
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
      ],
    },
  },
};

export default shiftingMirage;
