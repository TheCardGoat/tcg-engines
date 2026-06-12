import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipRoyalExplorerI18n } from "./083-prince-phillip-royal-explorer.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const princePhillipRoyalExplorer: CharacterCard = {
  id: "ccM",
  canonicalId: "ci_ccM",
  reprints: ["set6-083"],
  cardType: "character",
  name: "Prince Phillip",
  version: "Royal Explorer",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "006",
  cardNumber: 83,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_11902901f7364369970762d49a1a760d",
    tcgPlayer: 593039,
  },
  text: "Ward",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [ward],
  i18n: princePhillipRoyalExplorerI18n,
};
