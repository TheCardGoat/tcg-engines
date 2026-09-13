import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironsong-versus.generated.ts";

export const ironsongVersus = defineCard(fabCardIdentitiesByCanonicalId["JtPhDg9PkWmHb6jpCCPjz"], {
  keywords: [temper],
  abilities: {
    oncePerTurnActionNextSwordAttackTurnGets: {
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
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroCreateCourageToken",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "create-token",
                token: "courage",
                controller: "controller",
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
  },
});
