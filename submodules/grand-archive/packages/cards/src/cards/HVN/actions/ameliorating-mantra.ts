import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const amelioratingMantra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b3sm5e7pan",
  slug: "ameliorating-mantra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b3sm5e7pan:face:default",
      catalogId: "b3sm5e7pan",
      name: "Ameliorating Mantra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Remove two wither counters from each of up to two target objects.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "b3sm5e7pan-a1",
          kind: "card-resolution",
          text: "Remove two wither counters from each of up to two target objects.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
              },
            },
          ],
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "wither",
            amount: 2,
            bindResultAs: "removed-counters",
          },
        },
        {
          id: "b3sm5e7pan-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default amelioratingMantra;
