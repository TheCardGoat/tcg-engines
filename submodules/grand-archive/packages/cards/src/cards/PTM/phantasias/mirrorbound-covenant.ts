import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mirrorboundCovenant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PKnOTdQJJ1",
  slug: "mirrorbound-covenant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PKnOTdQJJ1:face:default",
      catalogId: "PKnOTdQJJ1",
      name: "Mirrorbound Covenant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\nEach player's maximum influence is seven. (As each player's end phase resolves, that player discards cards from their hand and/or memory until their influence is equal to their maximum influence.)",
      abilities: [
        {
          id: "PKnOTdQJJ1-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            to: "memory",
          },
        },
        {
          id: "PKnOTdQJJ1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Each player's maximum influence is seven. (As each player's end phase resolves, that player discards cards from their hand and/or memory until their influence is equal to their maximum influence.)",
          effects: [
            {
              kind: "continuous-player-property",
              players: "each-player",
              property: "maximum-influence",
              operation: "set",
              amount: 7,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default mirrorboundCovenant;
