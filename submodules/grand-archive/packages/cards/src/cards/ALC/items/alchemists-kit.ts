import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alchemistsKit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ettczb14m4",
  slug: "alchemists-kit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ettczb14m4:face:default",
      catalogId: "ettczb14m4",
      name: "Alchemist's Kit",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever you gather, put a refinement counter on Alchemist's Kit.\n\nBanish Alchemist's Kit: For every four refinement counters that was on Alchemist's Kit, draw a card.",
      abilities: [
        {
          id: "ettczb14m4-a1",
          kind: "triggered",
          text: "Whenever you gather, put a refinement counter on Alchemist's Kit.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "gather",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "ettczb14m4-a2",
          kind: "activated",
          text: "Banish Alchemist's Kit: For every four refinement counters that was on Alchemist's Kit, draw a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "refinement",
                  },
                  basis: "last-known",
                  missing: "zero",
                },
                4,
              ],
              rounding: "down",
            },
          },
        },
      ],
    },
  },
};

export default alchemistsKit;
