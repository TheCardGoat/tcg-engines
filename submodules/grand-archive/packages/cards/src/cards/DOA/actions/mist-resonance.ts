import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistResonance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hw8dxKAnMX",
  slug: "mist-resonance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hw8dxKAnMX:face:default",
      catalogId: "hw8dxKAnMX",
      name: "Mist Resonance",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Allies you control get +1 LIFE until end of turn.\n\n[Class Bonus] Harmonize — If you've activated a Melody card this turn, allies you control assign damage with their life stat instead of power stat until end of turn.",
      abilities: [
        {
          id: "hw8dxKAnMX-a1",
          kind: "card-resolution",
          text: "Allies you control get +1 LIFE until end of turn.",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
              property: "life",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "hw8dxKAnMX-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Harmonize — If you've activated a Melody card this turn, allies you control assign damage with their life stat instead of power stat until end of turn.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "rule-modification",
              mode: "use-property",
              action: "assign-combat-damage",
              affectedSet: "locked",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              valueProperty: "life",
              duration: {
                kind: "this-turn",
              },
            },
          },
          label: {
            name: "Harmonize",
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
      ],
    },
  },
};

export default mistResonance;
