import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const signaltechOne: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7wKegim9Yl",
  slug: "signaltech-one",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7wKegim9Yl:face:default",
      catalogId: "7wKegim9Yl",
      name: "SignalTech One",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "VELTECH", "PHONE", "DEVICE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Look at the top four cards of your deck and then put them back in any order.\n\n(2), Sacrifice SignalTech One: Draw a card into your memory.",
      abilities: [
        {
          id: "7wKegim9Yl-a1",
          kind: "triggered",
          text: "On Enter: Look at the top four cards of your deck and then put them back in any order.",
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
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "referenced-cards",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                    orderChosenBy: "controller",
                  },
                },
              },
            ],
          },
        },
        {
          id: "7wKegim9Yl-a2",
          kind: "activated",
          text: "(2), Sacrifice SignalTech One: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default signaltechOne;
