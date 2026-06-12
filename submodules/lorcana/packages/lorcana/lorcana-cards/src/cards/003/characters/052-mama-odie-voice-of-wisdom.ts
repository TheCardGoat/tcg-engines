import type { CharacterCard } from "@tcg/lorcana-types";
import { mamaOdieVoiceOfWisdomI18n } from "./052-mama-odie-voice-of-wisdom.i18n";

export const mamaOdieVoiceOfWisdom: CharacterCard = {
  id: "MGp",
  canonicalId: "ci_7n1",
  reprints: ["set3-052", "set9-057"],
  cardType: "character",
  name: "Mama Odie",
  version: "Voice of Wisdom",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "003",
  cardNumber: 52,
  rarity: "uncommon",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_262e1faa79d74ec38f16ba92a9981e54",
    tcgPlayer: 650001,
  },
  text: [
    {
      title: "LISTEN TO YOUR MAMA NOW",
      description:
        "Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Sorcerer"],
  abilities: [
    {
      type: "triggered",
      id: "052-1",
      name: "LISTEN TO YOUR MAMA NOW",
      text: "Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: mamaOdieVoiceOfWisdomI18n,
};
