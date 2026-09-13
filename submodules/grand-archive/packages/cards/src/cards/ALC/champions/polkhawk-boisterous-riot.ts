import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const polkhawkBoisterousRiot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8eyeqhc37y",
  slug: "polkhawk-boisterous-riot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8eyeqhc37y:face:default",
      catalogId: "8eyeqhc37y",
      name: "Polkhawk, Boisterous Riot",
      lineageName: "Polkhawk",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "Polkhawk can only level up into another \"Polkhawk\" champion.\n\nOn Enter: If there's another fire element card in Polkhawk's lineage, the next Ranger ally card you activate this turn enters the field distant.",
      abilities: [
        {
          id: "8eyeqhc37y-a1",
          kind: "static",
          staticKind: "effects",
          text: 'Polkhawk can only level up into another "Polkhawk" champion.',
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "level-up",
              subject: {
                kind: "source",
              },
              destinationFilter: {
                kind: "champion-name",
                value: "Polkhawk",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "8eyeqhc37y-a2",
          kind: "triggered",
          text: "On Enter: If there's another fire element card in Polkhawk's lineage, the next Ranger ally card you activate this turn enters the field distant.",
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
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "subtype",
                  oneOf: ["RANGER"],
                },
              ],
            },
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["inner-lineage"],
                host: {
                  kind: "champion",
                  player: "controller",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
            },
            activationResult: {
              entryState: {
                state: "distant",
                value: true,
              },
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default polkhawkBoisterousRiot;
