import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incantationOfProsperity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9WeCxLlnbt",
  slug: "incantation-of-prosperity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9WeCxLlnbt:face:default",
      catalogId: "9WeCxLlnbt",
      name: "Incantation of Prosperity",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Depending on your Shifting Currents’ direction—\n• North or South— Empower 2.\n• East or West— Recover 2.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "9WeCxLlnbt-a1",
          kind: "card-resolution",
          text: "Depending on your Shifting Currents’ direction—\n• North or South— Empower 2.\n• East or West— Recover 2.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "any",
              conditions: [
                {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "North",
                  },
                },
                {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "South",
                  },
                },
              ],
            },
            then: {
              kind: "keyword-action",
              action: "empower",
              amount: 2,
            },
            else: {
              kind: "recover",
              player: "controller",
              amount: 2,
            },
          },
        },
        {
          id: "9WeCxLlnbt-a2",
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

export default incantationOfProsperity;
