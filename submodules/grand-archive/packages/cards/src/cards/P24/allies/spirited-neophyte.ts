import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritedNeophyte: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ekplmih8ra",
  slug: "spirited-neophyte",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ekplmih8ra:face:default",
      catalogId: "ekplmih8ra",
      name: "Spirited Neophyte",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Attack: If your Shifting Currents face North, empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
      abilities: [
        {
          id: "ekplmih8ra-a1",
          kind: "triggered",
          text: "On Attack: If your Shifting Currents face North, empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: {
                named: "shifting-currents",
                value: "North",
              },
            },
            then: {
              kind: "keyword-action",
              action: "empower",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default spiritedNeophyte;
