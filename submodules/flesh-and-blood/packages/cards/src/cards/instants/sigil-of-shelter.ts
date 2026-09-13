import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-shelter.generated.ts";

export const sigilOfShelter = definePitchFamily(fabPitchFamilies["sigil-of-shelter"], {
  parameters: { yellow: 2, blue: 1 },
  abilities: (amount) => ({
    preventNextDamage: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
  }),
});

export const { yellow: sigilOfShelterYellow, blue: sigilOfShelterBlue } = sigilOfShelter.cards;
