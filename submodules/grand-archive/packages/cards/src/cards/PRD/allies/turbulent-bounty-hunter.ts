import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const turbulentBountyHunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h7c79xRobA",
  slug: "turbulent-bounty-hunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h7c79xRobA:face:default",
      catalogId: "h7c79xRobA",
      name: "Turbulent Bounty Hunter",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Whenever an ally that Turbulent Bounty Hunter has dealt damage to this turn dies, put a buff counter on Turbulent Bounty Hunter. ",
      abilities: [
        {
          id: "h7c79xRobA-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever an ally that Turbulent Bounty Hunter has dealt damage to this turn dies, put a buff counter on Turbulent Bounty Hunter.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default turbulentBountyHunter;
