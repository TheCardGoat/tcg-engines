import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const channelingStone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EBWWwvSxr3",
  slug: "channeling-stone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EBWWwvSxr3:face:default",
      catalogId: "EBWWwvSxr3",
      name: "Channeling Stone",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Channeling Stone: The next card you activate this turn costs 2 less to activate.",
      abilities: [
        {
          id: "EBWWwvSxr3-a1",
          kind: "activated",
          text: "Banish Channeling Stone: The next card you activate this turn costs 2 less to activate.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
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

export default channelingStone;
