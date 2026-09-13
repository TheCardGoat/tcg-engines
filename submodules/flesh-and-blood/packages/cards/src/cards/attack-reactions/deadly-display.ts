import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/deadly-display.generated.ts";

export const deadlyDisplay = definePitchFamily(fabPitchFamilies["deadly-display"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    boostWeaponAndCreateFlurryIfSharpened: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { types: ["Weapon"] } },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: { type: "has-status", status: "sharpened" },
          then: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "createFlurryOnHit",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                    target: { kind: "hero" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: { type: "create-token", token: "flurry", controller: "controller" },
                },
              },
            },
            target: { selector: "binding", binding: "it" },
            duration: "permanent",
          },
        },
      ],
    },
  }),
});

export const {
  red: deadlyDisplayRed,
  yellow: deadlyDisplayYellow,
  blue: deadlyDisplayBlue,
} = deadlyDisplay.cards;
