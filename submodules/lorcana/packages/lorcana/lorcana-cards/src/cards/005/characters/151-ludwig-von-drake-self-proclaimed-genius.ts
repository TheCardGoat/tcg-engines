import type { CharacterCard } from "@tcg/lorcana-types";
import { ludwigVonDrakeSelfproclaimedGeniusI18n } from "./151-ludwig-von-drake-self-proclaimed-genius.i18n";

export const ludwigVonDrakeSelfproclaimedGenius: CharacterCard = {
  id: "rsj",
  canonicalId: "ci_rsj",
  reprints: ["set5-151"],
  cardType: "character",
  name: "Ludwig von Drake",
  version: "Self-Proclaimed Genius",
  inkType: ["sapphire"],
  set: "005",
  cardNumber: 151,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bf86b60333c941008da0bf213d54829b",
    tcgPlayer: 557728,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: ludwigVonDrakeSelfproclaimedGeniusI18n,
};
