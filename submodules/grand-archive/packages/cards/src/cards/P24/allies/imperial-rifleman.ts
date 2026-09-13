import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialRifleman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "17fzcyfrzr",
  slug: "imperial-rifleman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "17fzcyfrzr:face:default",
      catalogId: "17fzcyfrzr",
      name: "Imperial Rifleman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\n[Class Bonus] On Enter: Imperial Rifleman becomes distant. (Units stay distant until the end of their controller's turn. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "17fzcyfrzr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "17fzcyfrzr-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Imperial Rifleman becomes distant. (Units stay distant until the end of their controller's turn. Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default imperialRifleman;
