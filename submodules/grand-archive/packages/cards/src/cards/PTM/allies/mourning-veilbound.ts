import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mourningVeilbound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zyEMI5XNHt",
  slug: "mourning-veilbound",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zyEMI5XNHt:face:default",
      catalogId: "zyEMI5XNHt",
      name: "Mourning Veilbound",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)\n\nSacrifice Mourning Veilbound: Up to one target Specter ally gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "zyEMI5XNHt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can’t be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "zyEMI5XNHt-a2",
          kind: "activated",
          text: "Sacrifice Mourning Veilbound: Up to one target Specter ally gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default mourningVeilbound;
