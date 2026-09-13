import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/reality-refractor.generated.ts";

export const realityRefractor = defineCard(
  fabCardIdentitiesByCanonicalId["T8JJgk7GLGpcDQWWN9RH7"],
  {
    abilities: {
      illusionistAurasWeapons5BasePowerOncePerTurnActionResourceResourceAttack: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "type",
                value: "Weapon",
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    supertypes: ["Illusionist"],
                    subtypes: ["Aura"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "set-base",
              amount: 5,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    supertypes: ["Illusionist"],
                    subtypes: ["Aura"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "oncePerTurnActionResourceResourceAttack",
                  text: "",
                  kind: "activated",
                  abilityType: "action",
                  limit: {
                    count: 1,
                    per: "turn",
                  },
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: 2,
                  },
                  effect: {
                    type: "attack-with",
                    target: {
                      selector: "self",
                    },
                  },
                },
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    supertypes: ["Illusionist"],
                    subtypes: ["Aura"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
    },
  },
);
