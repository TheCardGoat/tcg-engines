import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tonorisLoneMercenary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zb14m4c8lj",
  slug: "tonoris-lone-mercenary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zb14m4c8lj:face:default",
      catalogId: "zb14m4c8lj",
      name: "Tonoris, Lone Mercenary",
      lineageName: "Tonoris",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "On Enter: Tonoris gains taunt until the beginning of your next turn. (While awake, this unit must be targeted before other units you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "zb14m4c8lj-a1",
          kind: "triggered",
          text: "On Enter: Tonoris gains taunt until the beginning of your next turn. (While awake, this unit must be targeted before other units you control during your opponents' attack declarations if able.)",
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
      ],
    },
  },
};

export default tonorisLoneMercenary;
