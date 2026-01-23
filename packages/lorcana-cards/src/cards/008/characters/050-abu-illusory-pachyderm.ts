import type { CharacterCard } from "@tcg/lorcana-types";

export const abuIllusoryPachyderm: CharacterCard = {
  id: "1xy",
  cardType: "character",
  name: "Abu",
  version: "Illusory Pachyderm",
  fullName: "Abu - Illusory Pachyderm",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nGRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  cardNumber: 50,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fc278a703770bc359b9bcfe2f95aeb009697b0a3",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};
