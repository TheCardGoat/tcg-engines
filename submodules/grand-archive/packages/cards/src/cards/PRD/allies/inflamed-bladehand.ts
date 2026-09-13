import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inflamedBladehand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zzH1XYFSP7",
  slug: "inflamed-bladehand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zzH1XYFSP7:face:default",
      catalogId: "zzH1XYFSP7",
      name: "Inflamed Bladehand",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus]Whenever your champion attacks, Inflamed Bladehand gets +2POWER until end of turn. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "zzH1XYFSP7-a1",
          kind: "triggered",
          text: "[Class Bonus]Whenever your champion attacks, Inflamed Bladehand gets +2POWER until end of turn. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
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
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
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
      ],
    },
  },
};

export default inflamedBladehand;
