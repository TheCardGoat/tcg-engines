import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const disorientingWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UfQh069mc3",
  slug: "disorienting-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UfQh069mc3:face:default",
      catalogId: "UfQh069mc3",
      name: "Disorienting Winds",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nReturn target ally to its owner's hand. Draw a card.",
      abilities: [
        {
          id: "UfQh069mc3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "UfQh069mc3-a2",
          kind: "card-resolution",
          text: "Return target ally to its owner's hand. Draw a card.",
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
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                destination: {
                  zone: "hand",
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

export default disorientingWinds;
