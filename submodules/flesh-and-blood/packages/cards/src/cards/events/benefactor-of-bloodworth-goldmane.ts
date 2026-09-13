import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/benefactor-of-bloodworth-goldmane.generated.ts";

export const benefactorOfBloodworthGoldmane = defineCard(
  fabCardIdentitiesByCanonicalId.w6dzmjnGppFHCRgmKMFbW,
  {
    abilities: {
      createGold: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
      empowerNextAttackFromGold: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "gainPowerFromGold",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "attack",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "source",
                    selector: "attack",
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: {
                    type: "count",
                    what: "cards-in-zone",
                    zone: "permanent",
                    player: "controller",
                    filter: {
                      name: "Gold",
                    },
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
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
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  },
);
