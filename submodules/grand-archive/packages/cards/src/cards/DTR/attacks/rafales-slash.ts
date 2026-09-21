import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rafalesSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rn1gmo124j",
  slug: "rafales-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rn1gmo124j:face:default",
      catalogId: "rn1gmo124j",
      name: "Rafale's Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Ciel Bonus] On Attack: You may pay (3). If you do, summon a Vacuous Servant token rested. (Apply this effect only if your champion is Ciel.)",
      abilities: [
        {
          id: "rn1gmo124j-a1",
          kind: "triggered",
          text: "[Ciel Bonus] On Attack: You may pay (3). If you do, summon a Vacuous Servant token rested. (Apply this effect only if your champion is Ciel.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
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
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 3,
                    },
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
                    kind: "summon",
                    object: "Vacuous Servant",
                    controller: "controller",
                    bindResultAs: "summoned-token",
                    entersWithStates: ["rested"],
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

export default rafalesSlash;
