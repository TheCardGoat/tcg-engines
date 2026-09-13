import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const focusingGem: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SpENiP3jbN",
  slug: "focusing-gem",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SpENiP3jbN:face:default",
      catalogId: "SpENiP3jbN",
      name: "Focusing Gem",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nHindered (This object enters the field rested.)\n\nREST, Banish Focusing Gem: The next card you activate this turn costs (3) less to activate.",
      abilities: [
        {
          id: "SpENiP3jbN-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "SpENiP3jbN-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "SpENiP3jbN-a3",
          kind: "activated",
          text: "REST, Banish Focusing Gem: The next card you activate this turn costs (3) less to activate.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
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
            amount: 3,
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

export default focusingGem;
