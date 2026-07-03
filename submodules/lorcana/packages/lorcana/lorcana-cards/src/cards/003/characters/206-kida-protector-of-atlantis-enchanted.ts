import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaProtectorOfAtlantisEnchantedI18n } from "./206-kida-protector-of-atlantis-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const kidaProtectorOfAtlantisEnchanted: CharacterCard = {
  id: "yew",
  canonicalId: "ci_L03",
  slug: "lorcana-ci_L03",
  printings: [
    {
      id: "set3-206-enchanted",
      artId: "ci_L03-enchanted",
      setCode: "set3",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-007"],
  cardType: "character",
  name: "Kida",
  version: "Protector of Atlantis",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae42b2ab4e074f3e91c29d4ba2c3e601",
    tcgPlayer: "539273",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "PERHAPS WE CAN SAVE OUR FUTURE",
      description:
        "When you play this character, all characters get -3 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(3),
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -3,
        stat: "strength",
        target: "ALL_CHARACTERS",
        type: "modify-stat",
      },
      id: "194-2",
      name: "PERHAPS WE CAN SAVE OUR FUTURE",
      text: "PERHAPS WE CAN SAVE OUR FUTURE When you play this character, all characters get -3 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kidaProtectorOfAtlantisEnchantedI18n,
};
