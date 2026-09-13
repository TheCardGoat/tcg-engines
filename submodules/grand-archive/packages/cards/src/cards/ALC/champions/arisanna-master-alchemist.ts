import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arisannaMasterAlchemist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ltv5klryvf",
  slug: "arisanna-master-alchemist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ltv5klryvf:face:default",
      catalogId: "ltv5klryvf",
      name: "Arisanna, Master Alchemist",
      lineageName: "Arisanna",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Arisanna Lineage (Arisanna, Master Alchemist must be leveled from a previous level "Arisanna" champion.)\n\nOn Enter: Gather twice.\n\nInherited Effect — At the beginning of your end phase, you may sacrifice two Herbs with the same name. If you do, draw a card.',
      abilities: [
        {
          id: "ltv5klryvf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Arisanna Lineage (Arisanna, Master Alchemist must be leveled from a previous level "Arisanna" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Arisanna",
          },
        },
        {
          id: "ltv5klryvf-a2",
          kind: "triggered",
          text: "On Enter: Gather twice.",
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
            kind: "repeat",
            count: 2,
            effect: {
              kind: "keyword-action",
              action: "gather",
            },
          },
        },
        {
          id: "ltv5klryvf-a3",
          kind: "triggered",
          text: "Inherited Effect — At the beginning of your end phase, you may sacrifice two Herbs with the same name. If you do, draw a card.",
          executionSource: "lineage-host",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "sacrificed-herbs",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                unique: true,
                allShareCharacteristic: "name",
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["HERB"],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "sacrifice",
                    subject: {
                      kind: "bound",
                      binding: "sacrificed-herbs",
                    },
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default arisannaMasterAlchemist;
