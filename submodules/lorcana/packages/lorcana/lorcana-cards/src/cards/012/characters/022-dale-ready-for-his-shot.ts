import type { CharacterCard } from "@tcg/lorcana-types";
import { daleReadyForHisShotI18n } from "./022-dale-ready-for-his-shot.i18n";

export const daleReadyForHisShot: CharacterCard = {
  id: "vS7",
  canonicalId: "ci_vS7",
  reprints: ["set12-022"],
  cardType: "character",
  name: "Dale",
  version: "Ready for His Shot",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 22,
  rarity: "legendary",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_66a5c1d3ac3e4e2c894c5a8604c10cc2",
  },
  text: [
    {
      title: "SPIKE SUIT",
      description:
        "During challenges, your characters deal damage with their {W} instead of their {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "vS7-1",
      type: "static",
      name: "SPIKE SUIT",
      text: "SPIKE SUIT During challenges, your characters deal damage with their {W} instead of their {S}.",
      effect: {
        type: "damage-source-stat-override",
        stat: "willpower",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  i18n: daleReadyForHisShotI18n,
};
