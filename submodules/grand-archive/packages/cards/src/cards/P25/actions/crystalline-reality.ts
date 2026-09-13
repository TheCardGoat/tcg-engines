import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystallineReality: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iPpwkMxDt5",
  slug: "crystalline-reality",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iPpwkMxDt5:face:default",
      catalogId: "iPpwkMxDt5",
      name: "Crystalline Reality",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Merlin Bonus] Prepare 1\n\nChoose one. If Crystalline Reality was prepared, choose two instead—\n• Summon a Memorite Blade token.\n• Your champion gains true sight until end of turn.\n• Draw a card into your memory.",
      abilities: [
        {
          id: "iPpwkMxDt5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
        },
        {
          id: "iPpwkMxDt5-a2",
          kind: "card-resolution",
          text: "Choose one. If Crystalline Reality was prepared, choose two instead—\n• Summon a Memorite Blade token.\n• Your champion gains true sight until end of turn.\n• Draw a card into your memory.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "prepared",
                },
                then: 2,
                else: 1,
              },
            },
            modes: [
              {
                id: "mode-1",
                text: "Summon a Memorite Blade token.",
                effect: {
                  kind: "summon",
                  object: "Memorite Blade",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
              {
                id: "mode-2",
                text: "Your champion gains true sight until end of turn.",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "champion",
                    player: "controller",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "true-sight",
                    },
                  },
                },
              },
              {
                id: "mode-3",
                text: "Draw a card into your memory",
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
      ],
    },
  },
};

export default crystallineReality;
