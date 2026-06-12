import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaProtectorOfAtlantisI18n } from "./007-kida-protector-of-atlantis.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const kidaProtectorOfAtlantis: CharacterCard = {
  id: "lw9",
  canonicalId: "ci_L03",
  reprints: ["set3-007"],
  cardType: "character",
  name: "Kida",
  version: "Protector of Atlantis",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 7,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae42b2ab4e074f3e91c29d4ba2c3e601",
    tcgPlayer: 539273,
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
  i18n: kidaProtectorOfAtlantisI18n,
};
