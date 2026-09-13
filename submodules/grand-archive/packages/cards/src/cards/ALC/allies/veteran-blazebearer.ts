import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veteranBlazebearer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "23yfzk96yd",
  slug: "veteran-blazebearer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "23yfzk96yd:face:default",
      catalogId: "23yfzk96yd",
      name: "Veteran Blazebearer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Enter: Veteran Blazebearer gains taunt until the beginning of your next turn.\n\n[Class Bonus] Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
      abilities: [
        {
          id: "23yfzk96yd-a1",
          kind: "triggered",
          text: "On Enter: Veteran Blazebearer gains taunt until the beginning of your next turn.",
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "taunt",
              },
            },
          },
        },
        {
          id: "23yfzk96yd-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
          keyword: {
            name: "steadfast",
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
        },
      ],
    },
  },
};

export default veteranBlazebearer;
