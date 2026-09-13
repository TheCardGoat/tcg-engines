import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vaporjetShieldbearer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8lrj52215u",
  slug: "vaporjet-shieldbearer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8lrj52215u:face:default",
      catalogId: "8lrj52215u",
      name: "Vaporjet Shieldbearer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)\n\n[Class Bonus] On Hit: Look at the top card of your deck. You may put that card into your graveyard.",
      abilities: [
        {
          id: "8lrj52215u-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
          keyword: {
            name: "steadfast",
          },
        },
        {
          id: "8lrj52215u-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Look at the top card of your deck. You may put that card into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
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

export default vaporjetShieldbearer;
