import type { CharacterCard } from "@tcg/lorcana-types";

export const abuIllusoryPachyderm: CharacterCard = {
  abilities: [
    {
      id: "1xy-1",
      keyword: "Vanish",
      text: "Vanish",
      type: "keyword",
    },
  ],
  cardNumber: 50,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Illusion"],
  cost: 6,
  externalIds: {
    ravensburger: "fc278a703770bc359b9bcfe2f95aeb009697b0a3",
  },
  franchise: "Aladdin",
  fullName: "Abu - Illusory Pachyderm",
  id: "1xy",
  inkType: ["amethyst", "steel"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Abu",
  set: "008",
  strength: 3,
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nGRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
  version: "Illusory Pachyderm",
  willpower: 7,
};
