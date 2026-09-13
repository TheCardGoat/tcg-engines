import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/luminaris.generated.ts";

export const luminaris = defineCard(fabCardIdentitiesByCanonicalId["TQ7Twhtm6zfkTTHTKdpJK"], {
  abilities: {
    duringActionPhaseIllusionistAurasWeapons1BasePowerOncePerTurnAction0Attack: {
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
                  supertypes: ["Illusionist"],
                  subtypes: ["Aura"],
                },
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
            amount: 1,
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
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "oncePerTurnAction0Attack",
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
                  amount: 0,
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
            duration: "while-condition",
          },
        ],
      },
    },
    thereYellowPitchZoneIllusionistAttacksGetGoAgain: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          color: ["yellow"],
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
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
              supertypes: ["Illusionist"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
