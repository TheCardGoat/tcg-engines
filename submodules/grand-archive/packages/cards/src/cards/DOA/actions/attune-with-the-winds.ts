import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const attuneWithTheWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ify06tSEVC",
  slug: "attune-with-the-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ify06tSEVC:face:default",
      catalogId: "ify06tSEVC",
      name: "Attune with the Winds",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a buff counter on each ally you control. (Allies get +1 power and +1 life for each buff counter on them.)\n\n[Class Bonus] Harmonize — If you've activated a Melody card this turn, draw a card.",
      abilities: [
        {
          id: "ify06tSEVC-a1",
          kind: "card-resolution",
          text: "Put a buff counter on each ally you control. (Allies get +1 power and +1 life for each buff counter on them.)",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "ify06tSEVC-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Harmonize — If you've activated a Melody card this turn, draw a card.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
          label: {
            name: "Harmonize",
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

export default attuneWithTheWinds;
