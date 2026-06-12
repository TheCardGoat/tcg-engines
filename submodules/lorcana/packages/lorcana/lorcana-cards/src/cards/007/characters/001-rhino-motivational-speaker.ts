import type { CharacterCard } from "@tcg/lorcana-types";
import { rhinoMotivationalSpeakerI18n } from "./001-rhino-motivational-speaker.i18n";

export const rhinoMotivationalSpeaker: CharacterCard = {
  id: "ZwR",
  canonicalId: "ci_ZwR",
  reprints: ["set7-001"],
  cardType: "character",
  name: "Rhino",
  version: "Motivational Speaker",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 1,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b817b45c424b49b98e7978f1dcf3d7db",
    tcgPlayer: 619407,
  },
  text: [
    {
      title: "DESTINY CALLING",
      description: "Your other characters get +2 {W}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      id: "15i-1",
      name: "DESTINY CALLING",
      text: "DESTINY CALLING Your other characters get +2 {W}.",
      type: "static",
    },
  ],
  i18n: rhinoMotivationalSpeakerI18n,
};
