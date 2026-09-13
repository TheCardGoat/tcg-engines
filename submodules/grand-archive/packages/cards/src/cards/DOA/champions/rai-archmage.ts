import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const raiArchmage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zdIhSL5RhK",
  slug: "rai-archmage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zdIhSL5RhK:face:default",
      catalogId: "zdIhSL5RhK",
      name: "Rai, Archmage",
      lineageName: "Rai",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Rai Lineage (Rai, Archmage must be leveled from a previous level "Rai" champion.)\n\nInherited Effect: Whenever you activate your first Mage action card each turn, put an enlighten counter on your champion. (Your champion has this ability as long as this card is part of its lineage.)',
      abilities: [
        {
          id: "zdIhSL5RhK-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Rai Lineage (Rai, Archmage must be leveled from a previous level "Rai" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Rai",
          },
        },
        {
          id: "zdIhSL5RhK-a2",
          kind: "triggered",
          text: "Inherited Effect: Whenever you activate your first Mage action card each turn, put an enlighten counter on your champion. (Your champion has this ability as long as this card is part of its lineage.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "class",
                      oneOf: ["MAGE"],
                    },
                  ],
                },
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default raiArchmage;
