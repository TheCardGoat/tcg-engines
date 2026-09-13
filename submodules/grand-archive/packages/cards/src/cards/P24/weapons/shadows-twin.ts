import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadowsTwin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5vettczb14",
  slug: "shadows-twin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5vettczb14:face:default",
      catalogId: "5vettczb14",
      name: "Shadow's Twin",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        durability: 5,
      },
      rulesText:
        "Whenever Shadow's Twin becomes loaded, it gets +2 POWER until end of turn.\n\n[Class Bonus] Whenever an attack using this weapon triggers an On Hit ability, that ability is triggered an additional time.",
      abilities: [
        {
          id: "5vettczb14-a1",
          kind: "triggered",
          text: "Whenever Shadow's Twin becomes loaded, it gets +2 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-loaded",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
              amount: 2,
            },
          },
        },
        {
          id: "5vettczb14-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Whenever an attack using this weapon triggers an On Hit ability, that ability is triggered an additional time.",
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
              kind: "trigger-multiplier",
              triggerName: "on-hit",
              event: {
                name: "attack-hit",
                using: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add",
                additionalTimes: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default shadowsTwin;
