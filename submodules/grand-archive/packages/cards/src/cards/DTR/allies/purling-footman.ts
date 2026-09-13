import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purlingFootman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z11p126ctq",
  slug: "purling-footman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z11p126ctq:face:default",
      catalogId: "z11p126ctq",
      name: "Purling Footman",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HUMAN", "FISH"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Attack: Look at the top card of your deck. You may put it into your graveyard.",
      abilities: [
        {
          id: "z11p126ctq-a1",
          kind: "triggered",
          text: "On Attack: Look at the top card of your deck. You may put it into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                    amount: 1,
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
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "graveyard",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default purlingFootman;
