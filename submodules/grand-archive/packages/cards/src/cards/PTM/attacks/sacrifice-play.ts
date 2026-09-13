import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sacrificePlay: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1jmQ9XSLph",
  slug: "sacrifice-play",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1jmQ9XSLph:face:default",
      catalogId: "1jmQ9XSLph",
      name: "Sacrifice Play",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "COMMAND"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "As an additional cost to activate this card, sacrifice up to two awake Chessman allies.\n\nCommand Chessman\n\nSacrifice Play enters the intent with +2POWER for each ally sacrificed this way.",
      abilities: [
        {
          id: "1jmQ9XSLph-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice up to two awake Chessman allies.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "up-to",
                  amount: 2,
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "object-state",
                  state: "awake",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1jmQ9XSLph-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "1jmQ9XSLph-a3",
          kind: "card-resolution",
          text: "Sacrifice Play enters the intent with +2POWER for each ally sacrificed this way.",
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-object",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            effect: {
              kind: "sacrifice",
              subject: {
                kind: "bound",
                binding: "sacrificed-object",
              },
            },
          },
        },
      ],
    },
  },
};

export default sacrificePlay;
