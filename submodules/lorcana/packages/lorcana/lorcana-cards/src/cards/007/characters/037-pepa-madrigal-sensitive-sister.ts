import type { CharacterCard } from "@tcg/lorcana-types";
import { pepaMadrigalSensitiveSisterI18n } from "./037-pepa-madrigal-sensitive-sister.i18n";

export const pepaMadrigalSensitiveSister: CharacterCard = {
  id: "gZm",
  canonicalId: "ci_gZm",
  reprints: ["set7-037"],
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Sensitive Sister",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 37,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dc149fc0470a4fc2a5cde6ba7dffbdd7",
    tcgPlayer: 619428,
  },
  text: [
    {
      title: "CLEAR SKIES, CLEAR SKIES",
      description: "Whenever one or more of your characters sings a song, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      id: "1km-1",
      name: "CLEAR SKIES, CLEAR SKIES",
      text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
      trigger: {
        event: "sing",
        on: "YOUR_CHARACTERS",
        restrictions: [{ type: "once-per-song" }],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: pepaMadrigalSensitiveSisterI18n,
};
