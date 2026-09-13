import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suddenDeluge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "at3fn2idd6",
  slug: "sudden-deluge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "at3fn2idd6:face:default",
      catalogId: "at3fn2idd6",
      name: "Sudden Deluge",
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
      elements: ["WATER"],
      stats: {
        power: 3,
      },
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\n[Class Bonus] On Champion Hit: If Sudden Deluge was prepared, that opponent puts the top ten cards from their deck into their graveyard.",
      abilities: [
        {
          id: "at3fn2idd6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "at3fn2idd6-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: If Sudden Deluge was prepared, that opponent puts the top ten cards from their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
              kind: "mill",
              player: "event-recipient-controller",
              amount: 10,
            },
          },
        },
      ],
    },
  },
};

export default suddenDeluge;
