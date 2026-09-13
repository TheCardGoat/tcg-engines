import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blindingBeam } from "./blinding-beam.ts";

export const blindingBeamI18n = defineFamilyI18n(blindingBeam, {
  en: {
    name: "Blinding Beam",
    typeText: "Light Instant",
    text: (amount) =>
      `Blinding Beam cost {r} less to play if it targets a Shadow Card.\nTarget attacking or defending attack action card gets -${amount}{p}.`,
  },
});

export const {
  red: blindingBeamRedI18n,
  yellow: blindingBeamYellowI18n,
  blue: blindingBeamBlueI18n,
} = blindingBeamI18n.cards;
