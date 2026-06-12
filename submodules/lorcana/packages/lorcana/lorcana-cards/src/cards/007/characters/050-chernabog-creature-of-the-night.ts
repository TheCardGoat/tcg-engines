import type { CharacterCard } from "@tcg/lorcana-types";
import { chernabogCreatureOfTheNightI18n } from "./050-chernabog-creature-of-the-night.i18n";

export const chernabogCreatureOfTheNight: CharacterCard = {
  id: "gAZ",
  canonicalId: "ci_gAZ",
  reprints: ["set7-050"],
  cardType: "character",
  name: "Chernabog",
  version: "Creature of the Night",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "007",
  cardNumber: 50,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_557e4cc6a67e4683ab3a48a35fcf6372",
    tcgPlayer: 619433,
  },
  text: [
    {
      title: "MIDNIGHT REVEL",
      description:
        "When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
      },
      id: "1x1-1",
      name: "MIDNIGHT REVEL",
      text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: chernabogCreatureOfTheNightI18n,
};
