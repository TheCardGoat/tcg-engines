import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgetfulConcoction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7kr1haizu8",
  slug: "forgetful-concoction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7kr1haizu8:face:default",
      catalogId: "7kr1haizu8",
      name: "Forgetful Concoction",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Brew — One Root, One Herb\n\nHindered (This object enters the field rested.)\n\nREST, Sacrifice Forgetful Concoction: Banish two cards at random from target opponent's memory. Return those cards to their memory at the beginning of their next end phase. Draw a card. ",
      abilities: [
        {
          id: "7kr1haizu8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Root, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Root",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "7kr1haizu8-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "7kr1haizu8-a3",
          kind: "activated",
          text: "REST, Sacrifice Forgetful Concoction: Banish two cards at random from target opponent's memory. Return those cards to their memory at the beginning of their next end phase. Draw a card.",
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
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "banished-memory-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  unique: true,
                  method: "random",
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                    actor: {
                      binding: "target-opponent",
                    },
                  },
                },
                limit: 1,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-memory-cards",
                  },
                  from: "banishment",
                  destination: {
                    zone: "memory",
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default forgetfulConcoction;
