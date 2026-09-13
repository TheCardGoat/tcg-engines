import { draw, onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snatch.generated.ts";

export const snatch = definePitchFamily(fabPitchFamilies.snatch, {
  abilities: () => ({
    drawOnHit: onHit(draw(1)),
  }),
});

export const { red: snatchRed, yellow: snatchYellow, blue: snatchBlue } = snatch.cards;
