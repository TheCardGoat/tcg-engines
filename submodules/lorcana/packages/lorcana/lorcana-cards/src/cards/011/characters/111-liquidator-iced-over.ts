import type { CharacterCard } from "@tcg/lorcana-types";
import { liquidatorIcedOverI18n } from "./111-liquidator-iced-over.i18n";
import { underdog } from "../../../helpers/abilities/underdog";
import { reckless } from "../../../helpers/abilities/reckless";

export const liquidatorIcedOver: CharacterCard = {
  id: "UCV",
  canonicalId: "ci_UCV",
  reprints: ["set11-111"],
  cardType: "character",
  name: "Liquidator",
  version: "Iced Over",
  inkType: ["ruby"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 111,
  rarity: "uncommon",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_109b0bfb7a374953b896f3d6d051c099",
    tcgPlayer: 676212,
  },
  text: [
    {
      title: "UNDERDOG",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
    {
      title: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain"],
  abilities: [underdog, reckless],
  i18n: liquidatorIcedOverI18n,
};
