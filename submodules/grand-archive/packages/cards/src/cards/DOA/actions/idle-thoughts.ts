import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const idleThoughts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rWhFC8XBaH",
  slug: "idle-thoughts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rWhFC8XBaH:face:default",
      catalogId: "rWhFC8XBaH",
      name: "Idle Thoughts",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Look at the top four cards of your deck and then put them back in any order.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "rWhFC8XBaH-a1",
          kind: "card-resolution",
          text: "Look at the top four cards of your deck and then put them back in any order.",
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
          id: "rWhFC8XBaH-a2",
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

export default idleThoughts;
