import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordSaintOfEveswind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a7lr70xglo",
  slug: "sword-saint-of-eveswind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a7lr70xglo:face:default",
      catalogId: "a7lr70xglo",
      name: "Sword Saint of Eveswind",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If Sword Saint of Eveswind entered from a banishment, put two buff counters on it.",
      abilities: [
        {
          id: "a7lr70xglo-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If Sword Saint of Eveswind entered from a banishment, put two buff counters on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
              state: "entered-from-banishment",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "event-subject",
              },
              counter: "buff",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default swordSaintOfEveswind;
