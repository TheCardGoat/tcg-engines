import type { CharacterCard } from "@tcg/lorcana-types";
import { gadgetHackwrenchPerceptiveMouseI18n } from "./151-gadget-hackwrench-perceptive-mouse.i18n";

export const gadgetHackwrenchPerceptiveMouse: CharacterCard = {
  id: "j00",
  canonicalId: "ci_j00",
  reprints: ["set6-151"],
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Perceptive Mouse",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 151,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_57018dbc35d34f65ab2480f09404907d",
    tcgPlayer: 585034,
  },
  classifications: ["Storyborn", "Ally", "Inventor"],
  i18n: gadgetHackwrenchPerceptiveMouseI18n,
};
