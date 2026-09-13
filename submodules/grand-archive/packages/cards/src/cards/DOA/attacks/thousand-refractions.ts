import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thousandRefractions: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XLbCBxla8K",
  slug: "thousand-refractions",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XLbCBxla8K:face:default",
      catalogId: "XLbCBxla8K",
      name: "Thousand Refractions",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
      },
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\n[Class Bonus] On Hit: If Thousand Refractions was prepared, wake up your champion and return Thousand Refractions to its owner's hand.",
      abilities: [
        {
          id: "XLbCBxla8K-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "XLbCBxla8K-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: If Thousand Refractions was prepared, wake up your champion and return Thousand Refractions to its owner's hand.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
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
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default thousandRefractions;
