import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const adeptSwordmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "txgvf6xpkq",
  slug: "adept-swordmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "txgvf6xpkq:face:default",
      catalogId: "txgvf6xpkq",
      name: "Adept Swordmaster",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.) \n\n[Class Bonus] Weapons you control get +1 POWER. (Apply this effect only if your champion's class matches this card's class.) ",
      abilities: [
        {
          id: "txgvf6xpkq-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "txgvf6xpkq-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Weapons you control get +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                },
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

export default adeptSwordmaster;
