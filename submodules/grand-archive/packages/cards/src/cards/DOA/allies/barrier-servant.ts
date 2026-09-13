import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const barrierServant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xW6SZSlJX6",
  slug: "barrier-servant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xW6SZSlJX6:face:default",
      catalogId: "xW6SZSlJX6",
      name: "Barrier Servant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nRemove two enlighten counters from your champion: The next time damage would be dealt to Barrier Servant this turn, prevent that damage.",
      abilities: [
        {
          id: "xW6SZSlJX6-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "xW6SZSlJX6-a2",
          kind: "activated",
          text: "Remove two enlighten counters from your champion: The next time damage would be dealt to Barrier Servant this turn, prevent that damage.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 2,
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "source",
              },
            },
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default barrierServant;
