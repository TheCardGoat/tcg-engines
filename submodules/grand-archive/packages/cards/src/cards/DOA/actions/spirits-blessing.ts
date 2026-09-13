import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritsBlessing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qaA3sXFRFY",
  slug: "spirits-blessing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qaA3sXFRFY:face:default",
      catalogId: "qaA3sXFRFY",
      name: "Spirit's Blessing",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, return a regalia you control to its owner's material deck.\nWake up your champion. Draw a card.",
      abilities: [
        {
          id: "qaA3sXFRFY-a1",
          kind: "card-resolution",
          text: "As an additional cost to activate this card, return a regalia you control to its owner's material deck.\nWake up your champion. Draw a card.",
          additionalCost: {
            kind: "select-and-move",
            player: "controller",
            from: "field",
            to: "material-deck",
            count: {
              kind: "exactly",
              amount: 1,
            },
            filter: {
              kind: "supertype",
              oneOf: ["REGALIA"],
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "wake",
                subject: {
                  kind: "champion",
                  player: "controller",
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
      ],
    },
  },
};

export default spiritsBlessing;
