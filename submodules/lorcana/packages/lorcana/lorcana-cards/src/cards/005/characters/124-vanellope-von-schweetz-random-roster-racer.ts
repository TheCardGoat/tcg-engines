import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzRandomRosterRacerI18n } from "./124-vanellope-von-schweetz-random-roster-racer.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const vanellopeVonSchweetzRandomRosterRacer: CharacterCard = {
  id: "yeD",
  canonicalId: "ci_yeD",
  reprints: ["set5-124"],
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Random Roster Racer",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 124,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a24dcdebfc7246d4be1faad573e0a23e",
    tcgPlayer: 555271,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "PIXLEXIA",
      description:
        "When you play this character, she gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
  abilities: [
    rush,
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "a4q-2",
      name: "PIXLEXIA",
      text: "PIXLEXIA When you play this character, she gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: vanellopeVonSchweetzRandomRosterRacerI18n,
};
