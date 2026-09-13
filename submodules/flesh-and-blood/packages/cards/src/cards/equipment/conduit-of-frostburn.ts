import { quell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/conduit-of-frostburn.generated.ts";

export const conduitOfFrostburn = defineCard(
  fabCardIdentitiesByCanonicalId["dzP7wmmnGhcPk78jJpwQ6"],
  {
    keywords: [quell(1)],
    abilities: {
      instantDestroyConduitFrostburnNextPlayTurnEffectDeals: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenDealsArcaneDamageHeroDestroyFrozenTheirArsenal",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "dealt-damage",
                  actor: {
                    kind: "any",
                  },
                  observes: {
                    kind: "none",
                  },
                  target: {
                    kind: "hero",
                  },
                  damageType: "arcane",
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["arsenal"],
                    filter: {
                      hasStatus: "frozen",
                    },
                    count: 1,
                  },
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
              hasStatus: "arcane-damage-effect",
            },
          },
        },
      },
    },
  },
);
