import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const musicalCurator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l65WqDzBMt",
  slug: "musical-curator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l65WqDzBMt:face:default",
      catalogId: "l65WqDzBMt",
      name: "Musical Curator",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "RESONATOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: Choose Harmony or Melody. Scavenge 12 for a card of that subtype. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "l65WqDzBMt-a1",
          kind: "triggered",
          text: "On Enter: Choose Harmony or Melody. Scavenge 12 for a card of that subtype. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                trackAs: "chosen-subtype",
                selection: {
                  id: "chosen-subtype",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "option",
                    options: ["HARMONY", "MELODY"],
                  },
                },
              },
              {
                kind: "keyword-action",
                action: "scavenge",
                player: "controller",
                amount: 12,
                filter: {
                  kind: "matches-tracked-characteristic",
                  key: "chosen-subtype",
                  characteristic: "subtype",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default musicalCurator;
