import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const priestessOfFlame: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "opvc8sugly",
  slug: "priestess-of-flame",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "opvc8sugly:face:default",
      catalogId: "opvc8sugly",
      name: "Priestess of Flame",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: You may have Priestess of Flame deal 3 damage to your champion. If you do, gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "opvc8sugly-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may have Priestess of Flame deal 3 damage to your champion. If you do, gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "champion",
                      player: "controller",
                    },
                    amount: 3,
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "repeat",
                    count: 2,
                    effect: {
                      kind: "keyword-action",
                      action: "gather",
                    },
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

export default priestessOfFlame;
