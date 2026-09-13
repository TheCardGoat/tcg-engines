import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sealedBladeDoa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mDN1CI9IEe",
  slug: "sealed-blade-doa",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mDN1CI9IEe:face:default",
      catalogId: "mDN1CI9IEe",
      name: "Sealed Blade",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        "Pay only using floating memory for this card's memory cost.\n\n[Class Bonus] Sealed Blade gets +1 POWER.",
      abilities: [
        {
          id: "mDN1CI9IEe-a1",
          kind: "static",
          staticKind: "effects",
          text: "Pay only using floating memory for this card's memory cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              paymentSourceFilter: {
                kind: "has-keyword",
                keyword: "floating-memory",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "mDN1CI9IEe-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Sealed Blade gets +1 POWER.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default sealedBladeDoa;
