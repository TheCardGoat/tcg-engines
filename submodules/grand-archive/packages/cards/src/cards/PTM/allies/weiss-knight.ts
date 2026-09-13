import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weissKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IBXLKkBUe1",
  slug: "weiss-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IBXLKkBUe1:face:default",
      catalogId: "IBXLKkBUe1",
      name: "Weiss Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "KNIGHT", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1 POWER.)\n\nWhenever you activate a Chessman Command card, Weiss Knight gains unblockable until end of turn. (The attacks of a unit with unblockable can’t be intercepted and ignores taunt.)",
      abilities: [
        {
          id: "IBXLKkBUe1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1 POWER.)",
          keyword: {
            name: "commanded-will",
            value: 1,
          },
        },
        {
          id: "IBXLKkBUe1-a2",
          kind: "triggered",
          text: "Whenever you activate a Chessman Command card, Weiss Knight gains unblockable until end of turn. (The attacks of a unit with unblockable can’t be intercepted and ignores taunt.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["COMMAND"],
                },
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "unblockable",
              },
            },
          },
        },
      ],
    },
  },
};

export default weissKnight;
