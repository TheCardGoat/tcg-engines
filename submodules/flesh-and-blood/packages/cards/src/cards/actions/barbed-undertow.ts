import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/barbed-undertow.generated.ts";

export const barbedUndertow = definePitchFamily(fabPitchFamilies["barbed-undertow"], {
  abilities: () => ({
    ifBarbedUndertowHasAimCounterGainsWhenHits: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "named",
          name: "aim",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroChooseRedYellowBlueUntilStart",
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
                type: "sequence",
                steps: [
                  {
                    type: "choose-color",
                  },
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "pitch",
                    filter: {
                      color: ["chosen"],
                    },
                    duration: "until-start-of-own-next-turn",
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { red: barbedUndertowRed } = barbedUndertow.cards;
