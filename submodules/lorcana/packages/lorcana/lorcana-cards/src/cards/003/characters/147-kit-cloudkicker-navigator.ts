import type { CharacterCard } from "@tcg/lorcana-types";
import { kitCloudkickerNavigatorI18n } from "./147-kit-cloudkicker-navigator.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { ward } from "../../../helpers/abilities/ward";

export const kitCloudkickerNavigator: CharacterCard = {
  id: "RK7",
  canonicalId: "ci_RK7",
  reprints: ["set3-147"],
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Navigator",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 147,
  rarity: "uncommon",
  cost: 6,
  strength: 2,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d77c74eca9ae4b56b85f6c1feac4c1c5",
    tcgPlayer: 539097,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Ward",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [shift(3), ward],
  i18n: kitCloudkickerNavigatorI18n,
};
