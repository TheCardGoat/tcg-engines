import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hoarfrostSpine: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5hns3byfm8",
  slug: "hoarfrost-spine",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5hns3byfm8:face:default",
      catalogId: "5hns3byfm8",
      name: "Hoarfrost Spine",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BOW"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)\n\nOn Enter: Look at the top card of your deck. You may put that card into your graveyard.",
      abilities: [
        {
          id: "5hns3byfm8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "bow",
          },
        },
        {
          id: "5hns3byfm8-a2",
          kind: "triggered",
          text: "On Enter: Look at the top card of your deck. You may put that card into your graveyard.",
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

export default hoarfrostSpine;
