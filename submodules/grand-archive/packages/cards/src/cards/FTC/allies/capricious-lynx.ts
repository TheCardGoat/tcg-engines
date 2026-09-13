import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const capriciousLynx: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v1au7t9m4m",
  slug: "capricious-lynx",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v1au7t9m4m:face:default",
      catalogId: "v1au7t9m4m",
      name: "Capricious Lynx",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "CAT"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 4 (This ally won't obey you unless your champion is level 4 or higher.)\n\n[Class Bonus] On Enter: Capricious Lynx loses all abilities until end of turn.",
      abilities: [
        {
          id: "v1au7t9m4m-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 4 (This ally won't obey you unless your champion is level 4 or higher.)",
          keyword: {
            name: "pride",
            value: 4,
          },
        },
        {
          id: "v1au7t9m4m-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Capricious Lynx loses all abilities until end of turn.",
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
            kind: "continuous",
            subjects: {
              kind: "source",
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
              kind: "remove-abilities",
            },
          },
        },
      ],
    },
  },
};

export default capriciousLynx;
