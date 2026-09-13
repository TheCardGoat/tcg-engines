import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const discoverTheDivine: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YJacXvwTiX",
  slug: "discover-the-divine",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YJacXvwTiX:face:default",
      catalogId: "YJacXvwTiX",
      name: "Discover the Divine",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "You may remove four enlighten counters from your champion. If you do, level up your champion. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
      abilities: [
        {
          id: "YJacXvwTiX-a1",
          kind: "card-resolution",
          text: "You may remove four enlighten counters from your champion. If you do, level up your champion. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "remove-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "enlighten",
                  amount: 4,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "level-up",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default discoverTheDivine;
