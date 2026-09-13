import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bombardFlarecannon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oqk1l75tlz",
  slug: "bombard-flarecannon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oqk1l75tlz:face:default",
      catalogId: "oqk1l75tlz",
      name: "Bombard Flarecannon",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        durability: 4,
      },
      rulesText:
        "[Polkhawk Bonus] On Attack: If there is a fire element card in this attacker's intent, deal 2 damage to each unit the defending player controls. (Apply this effect only if your champion is Polkhawk.)",
      abilities: [
        {
          id: "oqk1l75tlz-a1",
          kind: "triggered",
          text: "[Polkhawk Bonus] On Attack: If there is a fire element card in this attacker's intent, deal 2 damage to each unit the defending player controls. (Apply this effect only if your champion is Polkhawk.)",
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
                name: "Polkhawk",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["intent"],
                host: {
                  kind: "event-attacker",
                },
                relationship: "intent-of",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "defending-player",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default bombardFlarecannon;
