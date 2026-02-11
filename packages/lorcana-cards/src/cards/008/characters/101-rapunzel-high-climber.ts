import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelHighClimber: CharacterCard = {
  abilities: [
    {
      id: "1ob-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      id: "1ob-2",
      name: "WRAPPED UP",
      text: "WRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 101,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "d96ca6b70852fff25f38145aaf2d764a4e530e4f",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - High Climber",
  id: "1ob",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rapunzel",
  set: "008",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
  version: "High Climber",
  willpower: 5,
};
