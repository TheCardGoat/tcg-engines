import type { CharacterCard } from "@tcg/lorcana-types";
import { montereyJackDefiantProtectorI18n } from "./188-monterey-jack-defiant-protector.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const montereyJackDefiantProtector: CharacterCard = {
  id: "scr",
  canonicalId: "ci_scr",
  reprints: ["set8-188"],
  cardType: "character",
  name: "Monterey Jack",
  version: "Defiant Protector",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "008",
  cardNumber: 188,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c36fb1d14427405e9855584cc3303929",
    tcgPlayer: 631474,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: montereyJackDefiantProtectorI18n,
};
