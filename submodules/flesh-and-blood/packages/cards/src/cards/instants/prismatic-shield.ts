import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/prismatic-shield.generated.ts";

export const prismaticShield = definePitchFamily(fabPitchFamilies["prismatic-shield"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (count) => ({
    createSpectralShields: {
      type: "create-token",
      token: "spectral-shield",
      controller: "controller",
      count,
    },
  }),
});

export const {
  red: prismaticShieldRed,
  yellow: prismaticShieldYellow,
  blue: prismaticShieldBlue,
} = prismaticShield.cards;
