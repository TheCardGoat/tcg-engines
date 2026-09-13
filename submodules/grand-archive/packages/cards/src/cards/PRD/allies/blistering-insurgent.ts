import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blisteringInsurgent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XgnBkRQgg1",
  slug: "blistering-insurgent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XgnBkRQgg1:face:default",
      catalogId: "XgnBkRQgg1",
      name: "Blistering Insurgent",
      cost: {
        kind: "reserve",
        amount: 2,
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
        life: 1,
      },
      rulesText:
        "Whenever your champion attacks for the first time each turn, Blistering Insurgent gets +1POWER until end of turn.",
      abilities: [
        {
          id: "XgnBkRQgg1-a1",
          kind: "triggered",
          text: "Whenever your champion attacks for the first time each turn, Blistering Insurgent gets +1POWER until end of turn.",
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
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
            },
          },
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default blisteringInsurgent;
