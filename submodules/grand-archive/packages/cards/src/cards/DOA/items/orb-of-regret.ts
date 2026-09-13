import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbOfRegret: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "BY0E8si926",
  slug: "orb-of-regret",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "BY0E8si926:face:default",
      catalogId: "BY0E8si926",
      name: "Orb of Regret",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Orb of Regret: Shuffle up to three cards from your hand into your deck, then draw that many cards.",
      abilities: [
        {
          id: "BY0E8si926-a1",
          kind: "activated",
          text: "Banish Orb of Regret: Shuffle up to three cards from your hand into your deck, then draw that many cards.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "choose",
            selection: {
              id: "shuffled-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "shuffled-cards",
                  },
                  from: "hand",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "unordered",
                    },
                  },
                  bindResultAs: "shuffled-card-count",
                },
                {
                  kind: "shuffle",
                  player: "controller",
                  zone: "main-deck",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "binding-count",
                    binding: "shuffled-card-count",
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

export default orbOfRegret;
