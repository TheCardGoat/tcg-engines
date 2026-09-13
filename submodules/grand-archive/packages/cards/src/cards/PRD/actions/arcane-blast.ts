import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcaneBlast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pn9gQjV3Rb",
  slug: "arcane-blast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pn9gQjV3Rb:face:default",
      catalogId: "pn9gQjV3Rb",
      name: "Arcane Blast",
      cost: {
        kind: "reserve",
        amount: 11,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nDeal 11 damage to target champion.",
      abilities: [
        {
          id: "pn9gQjV3Rb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
          },
        },
        {
          id: "pn9gQjV3Rb-a2",
          kind: "card-resolution",
          text: "Deal 11 damage to target champion.",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 11,
          },
        },
      ],
    },
  },
};

export default arcaneBlast;
