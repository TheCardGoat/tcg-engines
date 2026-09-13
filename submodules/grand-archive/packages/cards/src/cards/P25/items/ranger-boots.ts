import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rangerBoots: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fbs9qzo3f6",
  slug: "ranger-boots",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fbs9qzo3f6:face:default",
      catalogId: "fbs9qzo3f6",
      name: "Ranger Boots",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nOn Enter: Draw a card.\n\n[Class Bonus] REST, Banish Ranger Boots: Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "fbs9qzo3f6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "fbs9qzo3f6-a2",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "fbs9qzo3f6-a3",
          kind: "activated",
          text: "[Class Bonus] REST, Banish Ranger Boots: Your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
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
              kind: "champion",
              player: "controller",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default rangerBoots;
