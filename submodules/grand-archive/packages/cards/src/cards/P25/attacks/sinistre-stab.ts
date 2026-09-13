import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinistreStab: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e1xj8mqr2o",
  slug: "sinistre-stab",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e1xj8mqr2o:face:default",
      catalogId: "e1xj8mqr2o",
      name: "Sinistre Stab",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CURSE", "SWORD"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
      },
      rulesText:
        "On Hit: If you have five or more omens, you may put Sinistre Stab on the bottom of the hit champion's lineage. Otherwise, put Sinistre Stab on the bottom of your champion's lineage.\n\nInherited Effect — This object gets -3LIFE. (Champions have this ability as long as this card is part of its lineage.) ",
      abilities: [
        {
          id: "e1xj8mqr2o-a1",
          kind: "triggered",
          text: "On Hit: If you have five or more omens, you may put Sinistre Stab on the bottom of the hit champion's lineage. Otherwise, put Sinistre Stab on the bottom of your champion's lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-property-compare",
              players: "controller",
              quantifier: "all",
              property: "omens",
              operator: "gte",
              value: 5,
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "event-recipient",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
            },
            else: {
              kind: "move",
              subject: {
                kind: "source",
              },
              destination: {
                zone: "inner-lineage",
                host: {
                  kind: "champion",
                  player: "controller",
                },
                placement: {
                  kind: "bottom",
                },
              },
            },
          },
        },
        {
          id: "e1xj8mqr2o-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect — This object gets -3LIFE. (Champions have this ability as long as this card is part of its lineage.)",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "subtract",
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default sinistreStab;
