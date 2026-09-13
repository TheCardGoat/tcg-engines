import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dyadicFletcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hohkep3vi9",
  slug: "dyadic-fletcher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hohkep3vi9:face:default",
      catalogId: "hohkep3vi9",
      name: "Dyadic Fletcher",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ANIMAL", "HUMAN", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.) \n\n[Class Bonus] Whenever you activate an Aethercharge card for the second time each turn, Dyadic Fletcher becomes distant.",
      abilities: [
        {
          id: "hohkep3vi9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "hohkep3vi9-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate an Aethercharge card for the second time each turn, Dyadic Fletcher becomes distant.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["AETHERCHARGE"],
                },
              },
              occurrence: {
                count: 2,
                window: "this-turn",
                actorScope: "same-player",
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
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default dyadicFletcher;
