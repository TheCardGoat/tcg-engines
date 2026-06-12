import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarAspiringRulerI18n } from "./190-jafar-aspiring-ruler.i18n";

export const jafarAspiringRuler: CharacterCard = {
  id: "Fg9",
  canonicalId: "ci_Fg9",
  reprints: ["set7-190"],
  cardType: "character",
  name: "Jafar",
  version: "Aspiring Ruler",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 190,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_61da3f5c01564ae386af3de304e910af",
    tcgPlayer: 618177,
  },
  text: [
    {
      title: "THAT'S BETTER",
      description:
        "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      id: "1bu-1",
      name: "THAT'S BETTER",
      text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jafarAspiringRulerI18n,
};
