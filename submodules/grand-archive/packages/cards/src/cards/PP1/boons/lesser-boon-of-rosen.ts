import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfRosen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fJJBJ9M4c4",
  slug: "lesser-boon-of-rosen",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "fJJBJ9M4c4:face:default",
      catalogId: "fJJBJ9M4c4",
      name: "Lesser Boon of Rosen",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Ignore the elemental requirements of non-advanced element Automaton cards you activate.\n\n(3): Summon a Powercell token rested. Activate this ability only once.",
      abilities: [
        {
          id: "fJJBJ9M4c4-a1",
          kind: "static",
          staticKind: "effects",
          text: "Ignore the elemental requirements of non-advanced element Automaton cards you activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "element-category",
                    value: "non-advanced",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["AUTOMATON"],
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "fJJBJ9M4c4-a2",
          kind: "activated",
          text: "(3): Summon a Powercell token rested. Activate this ability only once.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default lesserBoonOfRosen;
