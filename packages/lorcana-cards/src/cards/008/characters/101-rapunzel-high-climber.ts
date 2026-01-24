import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelHighClimber: CharacterCard = {
  id: "1ob",
  cardType: "character",
  name: "Rapunzel",
  version: "High Climber",
  fullName: "Rapunzel - High Climber",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 101,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d96ca6b70852fff25f38145aaf2d764a4e530e4f",
  },
  abilities: [
    {
      id: "1ob-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1ob-2",
      type: "triggered",
      name: "WRAPPED UP",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      text: "WRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
