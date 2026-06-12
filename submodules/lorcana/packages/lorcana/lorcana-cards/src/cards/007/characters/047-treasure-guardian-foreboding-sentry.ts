import type { CharacterCard } from "@tcg/lorcana-types";
import { treasureGuardianForebodingSentryI18n } from "./047-treasure-guardian-foreboding-sentry.i18n";

export const treasureGuardianForebodingSentry: CharacterCard = {
  id: "1bI",
  canonicalId: "ci_1bI",
  reprints: ["set7-047"],
  cardType: "character",
  name: "Treasure Guardian",
  version: "Foreboding Sentry",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 47,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dde4814ef611454ca907668ed03b2027",
    tcgPlayer: 619431,
  },
  text: [
    {
      title: "UNTOLD TREASURE",
      description:
        "When you play this character, if you have an Illusion character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "9vb-1",
      condition: {
        type: "has-character-with-classification",
        classification: "Illusion",
        controller: "you",
      },
      effect: {
        type: "optional",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
      name: "UNTOLD TREASURE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
    },
  ],
  i18n: treasureGuardianForebodingSentryI18n,
};
