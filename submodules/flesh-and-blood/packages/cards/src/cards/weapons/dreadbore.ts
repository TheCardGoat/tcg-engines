import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/dreadbore.generated.ts";

export const dreadbore = defineCard(fabCardIdentitiesByCanonicalId["7WhjMkMzcRQ9M7cpzFcpH"], {
  abilities: {
    oncePerTurnActionResourcePutArrowHandFaceUpEmptyArsenalZoneGains1PowerEndTurnGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: 1,
          },
          to: {
            zone: "arsenal",
            visibility: "face-up",
          },
          outputBinding: "it",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "binding",
            binding: "it",
          },
          duration: "this-turn",
        },
      },
    },
    arrowsDefenseReactionsCantPlayedHandChainLink: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "defenseReactionsCantPlayedHandChainLink",
            text: "",
            kind: "resolution",
            effect: {
              type: "rule-modification",
              mode: "restrict",
              action: "defend",
              filter: {
                typeBox: { types: ["Defense Reaction"] },
                playedFromZones: ["hand"],
              },
              duration: "this-chain-link",
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain", "stack"],
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
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
