import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/cosmo-scroll-of-ancestral-tapestry.generated.ts";

export const cosmoScrollOfAncestralTapestry = defineCard(
  fabCardIdentitiesByCanonicalId["zMC89pqnzTP7bkmfjmTzQ"],
  {
    abilities: {
      duringTurnAurasWardWeaponsBasePowerEqualWardOncePerTurnActionResourceAttack: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "turn-player",
          who: "self",
        },
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
                    subtypes: ["Aura"],
                  },
                  hasKeyword: "ward",
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-condition",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "set-base",
              amount: {
                type: "keyword-value",
                keyword: "ward",
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                  hasKeyword: "ward",
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-condition",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "oncePerTurnActionResourceAttack",
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
                    amount: 1,
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
                    subtypes: ["Aura"],
                  },
                  hasKeyword: "ward",
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-condition",
            },
          ],
        },
      },
      auraAttacksOneMore1PowerCountersGetGoAgain: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Aura", "Attack"],
              },
              hasCounter: "+1{p}",
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
