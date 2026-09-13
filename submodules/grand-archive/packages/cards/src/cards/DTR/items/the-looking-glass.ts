import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theLookingGlass: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fln04uv297",
  slug: "the-looking-glass",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fln04uv297:face:default",
      catalogId: "fln04uv297",
      name: "The Looking Glass",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "DISTORTION", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nOmnishroud\n\nIf this card is in your starting material deck, you may begin the game with it on the field. \n\nIgnore the elemental requirements of Distortion cards you play.",
      abilities: [
        {
          id: "fln04uv297-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "fln04uv297-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "fln04uv297-a3",
          kind: "game-setup",
          text: "If this card is in your starting material deck, you may begin the game with it on the field.",
          rule: {
            kind: "optional-start-on-field",
            from: "material-deck",
            condition: "source-in-starting-deck",
          },
        },
        {
          id: "fln04uv297-a4",
          kind: "static",
          staticKind: "effects",
          text: "Ignore the elemental requirements of Distortion cards you play.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              filter: {
                kind: "subtype",
                oneOf: ["DISTORTION"],
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

export default theLookingGlass;
