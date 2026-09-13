import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sting-of-sorcery.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stingOfSorcery = definePitchFamily(fabPitchFamilies["sting-of-sorcery"], {
  keywords: [goAgain],
  abilities: () => ({
    attackActionControlGainWhenAttackWithDealNumber1ArcaneDamageHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttackWithDealNumber1ArcaneDamageHero",
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
                  kind: "event-object",
                  selector: "attack",
                  relationship: {
                    kind: "any",
                  },
                  filter: {
                    name: "This",
                  },
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "any-hero",
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    atBeginningEndPhaseDestroyStingSorcery: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: stingOfSorceryBlue } = stingOfSorcery.cards;
