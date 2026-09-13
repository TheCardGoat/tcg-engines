import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windfallCheck: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e1jCu0neWY",
  slug: "windfall-check",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e1jCu0neWY:face:default",
      catalogId: "e1jCu0neWY",
      name: "Windfall Check",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "COMMAND"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "Command Chessman (A Chessman ally you control performs this attack.)\n\nOn Champion Hit: That opponent banishes three cards from their graveyard.",
      abilities: [
        {
          id: "e1jCu0neWY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "e1jCu0neWY-a2",
          kind: "triggered",
          text: "On Champion Hit: That opponent banishes three cards from their graveyard.",
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
          effect: {
            kind: "banish",
            player: "event-recipient-controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "event-recipient-controller",
              count: {
                kind: "exactly",
                amount: 3,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "event-recipient-controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default windfallCheck;
