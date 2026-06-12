import type { CharacterCard } from "@tcg/lorcana-types";
import { wilhelminaPackardTheRadioOperatorI18n } from "./085-wilhelmina-packard-the-radio-operator.i18n";

export const wilhelminaPackardTheRadioOperator: CharacterCard = {
  id: "qK6",
  canonicalId: "ci_qK6",
  reprints: ["set8-085"],
  cardType: "character",
  name: "Wilhelmina Packard",
  version: "The Radio Operator",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "008",
  cardNumber: 85,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c20ae400ed1e4439be69f940428832fd",
    tcgPlayer: 631406,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: wilhelminaPackardTheRadioOperatorI18n,
};
