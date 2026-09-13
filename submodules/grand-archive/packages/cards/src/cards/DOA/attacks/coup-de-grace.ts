import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coupDeGrace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5qWWpkgQLl",
  slug: "coup-de-grace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5qWWpkgQLl:face:default",
      catalogId: "5qWWpkgQLl",
      name: "Coup de Grace",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "Prepare 4 (You may remove four preparation counters from your champion as you activate this card.)\n\n[Class Bonus] On Attack: If Coup de Grace was prepared, it gains critical 4. (If combat damage would be dealt by a source with critical 4, double that damage unless an opponent discards four cards.)",
      abilities: [
        {
          id: "5qWWpkgQLl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 4 (You may remove four preparation counters from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 4,
          },
        },
        {
          id: "5qWWpkgQLl-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If Coup de Grace was prepared, it gains critical 4. (If combat damage would be dealt by a source with critical 4, double that damage unless an opponent discards four cards.)",
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
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "critical",
                  value: 4,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default coupDeGrace;
