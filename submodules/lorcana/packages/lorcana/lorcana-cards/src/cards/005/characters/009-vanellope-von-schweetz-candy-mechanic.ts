import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzCandyMechanicI18n } from "./009-vanellope-von-schweetz-candy-mechanic.i18n";

export const vanellopeVonSchweetzCandyMechanic: CharacterCard = {
  id: "gcm",
  canonicalId: "ci_gcm",
  reprints: ["set5-009"],
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Candy Mechanic",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 9,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_48fb46a8fbdd4615a2c9ab99f304a0f2",
    tcgPlayer: 561946,
  },
  text: [
    {
      title: "YOU'VE GOT TO PAY TO PLAY",
      description:
        "Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Racer"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "18i-1",
      name: "YOU'VE GOT TO PAY TO PLAY",
      text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: vanellopeVonSchweetzCandyMechanicI18n,
};
