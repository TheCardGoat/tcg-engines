import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinSelfappointedMentorI18n } from "./153-merlin-self-appointed-mentor.i18n";
import { support } from "../../../helpers/abilities/support";

export const merlinSelfappointedMentor: CharacterCard = {
  id: "m4N",
  canonicalId: "ci_m4N",
  reprints: ["set1-153"],
  cardType: "character",
  name: "Merlin",
  version: "Self-Appointed Mentor",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "001",
  cardNumber: 153,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_47e91685dd1f4021908561ca134dfe94",
    tcgPlayer: 503354,
  },
  text: "Support",
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [support],
  i18n: merlinSelfappointedMentorI18n,
};
