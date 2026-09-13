import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const servantsObligation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f4wqesifxk",
  slug: "servants-obligation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f4wqesifxk:face:default",
      catalogId: "f4wqesifxk",
      name: "Servant's Obligation",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "RING"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Hindered\n\n[Ciel Bonus] As long as your champion hasn't been attacked this turn, your champion has taunt.\n\n[Ciel Bonus] (3), REST, Banish Servant's Obligation: Summon a Vacuous Servant token.",
      abilities: [
        {
          id: "f4wqesifxk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "f4wqesifxk-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as your champion hasn't been attacked this turn, your champion has taunt.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "not",
                condition: {
                  kind: "history",
                  event: "attack-declared",
                  window: "this-turn",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                  minimum: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "taunt",
                },
              },
            },
          ],
        },
        {
          id: "f4wqesifxk-a3",
          kind: "activated",
          text: "[Ciel Bonus] (3), REST, Banish Servant's Obligation: Summon a Vacuous Servant token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
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
      ],
    },
  },
};

export default servantsObligation;
