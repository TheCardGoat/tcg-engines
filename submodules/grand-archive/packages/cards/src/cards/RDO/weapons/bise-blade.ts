import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const biseBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aZzm2GEWEu",
  slug: "bise-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aZzm2GEWEu:face:default",
      catalogId: "aZzm2GEWEu",
      name: "Bise Blade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["EXALTED", "WIND"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "[Ciel Bonus] On Enter: Summon a Vacuous Servant token.\n\n[Ciel Bonus] (6): Suppress Bise Blade. This ability costs (1) less to activate for each omen you have with different reserve costs.",
      abilities: [
        {
          id: "aZzm2GEWEu-a1",
          kind: "triggered",
          text: "[Ciel Bonus] On Enter: Summon a Vacuous Servant token.",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Vacuous Servant",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "aZzm2GEWEu-a2",
          kind: "activated",
          text: "[Ciel Bonus] (6): Suppress Bise Blade. This ability costs (1) less to activate for each omen you have with different reserve costs.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 6,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
                distinctBy: "reserve-cost",
              },
            },
          ],
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
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default biseBlade;
