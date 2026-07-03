import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesMeticulousPlotterI18n } from "./145-hades-meticulous-plotter.i18n";

export const hadesMeticulousPlotter: CharacterCard = {
  id: "Otw",
  canonicalId: "ci_Otw",
  slug: "lorcana-ci_Otw",
  printings: [
    {
      id: "set4-145",
      artId: "set4-145",
      setCode: "set4",
      collectorNumber: "145",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-145"],
  cardType: "character",
  name: "Hades",
  version: "Meticulous Plotter",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 145,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d555fad606ee4b13b0493364de8c4cda",
    tcgPlayer: "550606",
  },
  classifications: ["Storyborn", "Villain", "Deity"],
  i18n: hadesMeticulousPlotterI18n,
};
