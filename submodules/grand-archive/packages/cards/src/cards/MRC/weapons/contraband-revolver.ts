import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const contrabandRevolver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8iopvc8sug",
  slug: "contraband-revolver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8iopvc8sug:face:default",
      catalogId: "8iopvc8sug",
      name: "Contraband Revolver",
      cost: {
        kind: "memory",
        amount: 0,
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
        durability: 1,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)\n\n[Class Bonus] On Attack: If the attacker is attacking a champion, Contraband Revolver gets +2 POWER for this attack.",
      abilities: [
        {
          id: "8iopvc8sug-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can’t be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "8iopvc8sug-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If the attacker is attacking a champion, Contraband Revolver gets +2 POWER for this attack.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "combat-relation",
              relation: "attacking",
              subject: {
                kind: "event-attacker",
              },
              otherFilter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          },
        },
      ],
    },
  },
};

export default contrabandRevolver;
