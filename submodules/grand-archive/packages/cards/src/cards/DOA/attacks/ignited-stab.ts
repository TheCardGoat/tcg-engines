import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ignitedStab: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GRkBQ1Uvir",
  slug: "ignited-stab",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GRkBQ1Uvir:face:default",
      catalogId: "GRkBQ1Uvir",
      name: "Ignited Stab",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\n[Class Bonus] On Attack: If Ignited Stab was prepared, it gets +2 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "GRkBQ1Uvir-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "GRkBQ1Uvir-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If Ignited Stab was prepared, it gets +2 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
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

export default ignitedStab;
