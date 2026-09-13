import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/anaphylactic-shock.generated.ts";

export const anaphylacticShock = definePitchFamily(fabPitchFamilies["anaphylactic-shock"], {
  abilities: () => ({
    eachOpposingHeroAllyHasDealtDamageTurnLoses: {
      kind: "resolution",
      effect: {
        type: "lose-life",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hero", "permanent"],
          filter: {
            dealtDamageToControllerThisTurn: true,
          },
          count: {
            type: "all",
          },
        },
      },
    },
  }),
});

export const { blue: anaphylacticShockBlue } = anaphylacticShock.cards;
