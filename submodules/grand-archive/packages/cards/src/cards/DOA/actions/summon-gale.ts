import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const summonGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZgA7cWNKGy",
  slug: "summon-gale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZgA7cWNKGy:face:default",
      catalogId: "ZgA7cWNKGy",
      name: "Summon Gale",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)\n\nReturn target ally to its owner's hand.",
      abilities: [
        {
          id: "ZgA7cWNKGy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "efficiency",
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
        {
          id: "ZgA7cWNKGy-a2",
          kind: "card-resolution",
          text: "Return target ally to its owner's hand.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "hand",
            },
          },
        },
      ],
    },
  },
};

export default summonGale;
