import type { CharacterCard } from "@tcg/lorcana-types";
import { tukTukWreckingBallI18n } from "./128-tuk-tuk-wrecking-ball.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const tukTukWreckingBall: CharacterCard = {
  id: "xpC",
  canonicalId: "ci_xpC",
  reprints: ["set2-128"],
  cardType: "character",
  name: "Tuk Tuk",
  version: "Wrecking Ball",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 128,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_afce8f318b6d4d68a9ff9ccb5a616655",
    tcgPlayer: 527759,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Ally"],
  abilities: [reckless],
  i18n: tukTukWreckingBallI18n,
};
