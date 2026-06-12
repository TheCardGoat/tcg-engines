import type { CharacterCard } from "@tcg/lorcana-types";
import { bobbyPurplePigeonI18n } from "./182-bobby-purple-pigeon.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const bobbyPurplePigeon: CharacterCard = {
  id: "hjd",
  canonicalId: "ci_hjd",
  reprints: ["set8-182"],
  cardType: "character",
  name: "Bobby",
  version: "Purple Pigeon",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 182,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_88d71cff12ab4e23940f32ab8c568af4",
    tcgPlayer: 631471,
  },
  text: "Bodyguard",
  classifications: ["Storyborn"],
  abilities: [bodyguard],
  i18n: bobbyPurplePigeonI18n,
};
