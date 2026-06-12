import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodEyeForDetailI18n } from "./170-robin-hood-eye-for-detail.i18n";
import { support } from "../../../helpers/abilities/support";

export const robinHoodEyeForDetail: CharacterCard = {
  id: "JTC",
  canonicalId: "ci_JTC",
  reprints: ["set7-170"],
  cardType: "character",
  name: "Robin Hood",
  version: "Eye for Detail",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "007",
  cardNumber: 170,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_35c7b95d00c14614857dcb98e4fb99e1",
    tcgPlayer: 618712,
  },
  text: "Support",
  classifications: ["Storyborn", "Hero"],
  abilities: [support],
  i18n: robinHoodEyeForDetailI18n,
};
