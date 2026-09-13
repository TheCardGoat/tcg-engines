import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/astral-etchings.generated.ts";

const abilities = (pitch: number) =>
  ({
    addCounterPower: {
      kind: "resolution",
      effect: {
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        // Printed counter counts scale inversely with pitch: red 3, yellow 2, blue 1.
        count: 4 - pitch,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "ward",
          },
          count: 1,
        },
      },
    },
    playAsInstantWithSpectralShield: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "control-object",
        filter: {
          name: "Spectral Shield",
        },
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
  }) as const;

export const astralEtchings = definePitchFamily(fabPitchFamilies["astral-etchings"], {
  abilities: (_parameter, { pitch }) => abilities(Number(pitch)),
});

export const {
  red: astralEtchingsRed,
  yellow: astralEtchingsYellow,
  blue: astralEtchingsBlue,
} = astralEtchings.cards;
