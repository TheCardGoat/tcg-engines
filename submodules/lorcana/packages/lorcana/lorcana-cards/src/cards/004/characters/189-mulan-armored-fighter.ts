import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanArmoredFighterI18n } from "./189-mulan-armored-fighter.i18n";

export const mulanArmoredFighter: CharacterCard = {
  id: "104",
  canonicalId: "ci_6Mp",
  reprints: ["set4-189"],
  cardType: "character",
  name: "Mulan",
  version: "Armored Fighter",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 189,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_029ec16d7f294ef0a9e2b924ae6819ce",
    tcgPlayer: 550619,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: mulanArmoredFighterI18n,
};
