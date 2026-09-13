import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanishFromSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vm5kt3q2sv",
  slug: "vanish-from-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vm5kt3q2sv:face:default",
      catalogId: "vm5kt3q2sv",
      name: "Vanish from Sight",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's recollection phase.\n\nYour champion gains stealth until end of turn.",
      abilities: [
        {
          id: "vm5kt3q2sv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vm5kt3q2sv-a2",
          kind: "card-resolution",
          text: "Your champion gains stealth until end of turn.",
          effect: {
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
      ],
    },
  },
};

export default vanishFromSight;
