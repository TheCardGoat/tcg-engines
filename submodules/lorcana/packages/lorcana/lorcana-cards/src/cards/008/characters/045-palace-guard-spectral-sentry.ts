import type { CharacterCard } from "@tcg/lorcana-types";
import { palaceGuardSpectralSentryI18n } from "./045-palace-guard-spectral-sentry.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const palaceGuardSpectralSentry: CharacterCard = {
  id: "APE",
  canonicalId: "ci_APE",
  reprints: ["set8-045"],
  cardType: "character",
  name: "Palace Guard",
  version: "Spectral Sentry",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 45,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4c1ddfeea1142b192f7e289c5bb880d",
    tcgPlayer: 631336,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [vanish],
  i18n: palaceGuardSpectralSentryI18n,
};
