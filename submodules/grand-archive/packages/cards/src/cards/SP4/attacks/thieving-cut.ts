import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thievingCut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7t9m4muq2r",
  slug: "thieving-cut",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7t9m4muq2r:face:default",
      catalogId: "7t9m4muq2r",
      name: "Thieving Cut",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\nOn Hit: If Thieving Cut was prepared, draw a card.",
      abilities: [
        {
          id: "7t9m4muq2r-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "7t9m4muq2r-a2",
          kind: "triggered",
          text: "On Hit: If Thieving Cut was prepared, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default thievingCut;
