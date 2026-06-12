import type { CharacterCard } from "@tcg/lorcana-types";
import { druunRavenousPlagueI18n } from "./046-druun-ravenous-plague.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const druunRavenousPlague: CharacterCard = {
  id: "puQ",
  canonicalId: "ci_puQ",
  reprints: ["set8-046"],
  cardType: "character",
  name: "Druun",
  version: "Ravenous Plague",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  cardNumber: 46,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e147780b566e405e84ffe7dab98ab97f",
    tcgPlayer: 632708,
  },
  text: "Challenger +4",
  classifications: ["Storyborn", "Villain"],
  abilities: [challenger(4)],
  i18n: druunRavenousPlagueI18n,
};
