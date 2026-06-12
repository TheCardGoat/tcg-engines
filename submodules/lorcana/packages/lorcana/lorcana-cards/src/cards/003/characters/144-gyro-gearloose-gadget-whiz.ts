import type { CharacterCard } from "@tcg/lorcana-types";
import { gyroGearlooseGadgetWhizI18n } from "./144-gyro-gearloose-gadget-whiz.i18n";

export const gyroGearlooseGadgetWhiz: CharacterCard = {
  id: "nxo",
  canonicalId: "ci_nxo",
  reprints: ["set3-144"],
  cardType: "character",
  name: "Gyro Gearloose",
  version: "Gadget Whiz",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 144,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_921f3a8bbf1c486490121d18a6d45752",
    tcgPlayer: 539096,
  },
  text: [
    {
      title: "NOW TRY TO KEEP UP",
      description: "{E} — Put an item card from your discard on the top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "nxo-1",
      name: "NOW TRY TO KEEP UP",
      text: "NOW TRY TO KEEP UP {E} — Put an item card from your discard on the top of your deck.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "put-on-top",
        source: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["item"],
        },
      },
    },
  ],
  i18n: gyroGearlooseGadgetWhizI18n,
};
