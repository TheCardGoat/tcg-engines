import type { CharacterCard } from "@tcg/lorcana-types";
import { drFacilierFortuneTellerI18n } from "./079-dr-facilier-fortune-teller.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const drFacilierFortuneTeller: CharacterCard = {
  id: "WRE",
  canonicalId: "ci_WRE",
  reprints: ["set2-079"],
  cardType: "character",
  name: "Dr. Facilier",
  version: "Fortune Teller",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 79,
  rarity: "common",
  cost: 7,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d544feae1c8b4accae8e8f3d185380c4",
    tcgPlayer: 527745,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "YOU'RE IN MY WORLD",
      description:
        "Whenever this character quests, chosen opposing character can't quest during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "their-next-turn",
        restriction: "cant-quest",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "restriction",
      },
      id: "h8r-2",
      name: "YOU'RE IN MY WORLD",
      text: "YOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: drFacilierFortuneTellerI18n,
};
