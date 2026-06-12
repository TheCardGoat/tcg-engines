import type { CharacterCard } from "@tcg/lorcana-types";
import { benEccentricRobotI18n } from "./137-ben-eccentric-robot.i18n";
import { support } from "../../../helpers/abilities/support";

export const benEccentricRobot: CharacterCard = {
  id: "bXM",
  canonicalId: "ci_bXM",
  reprints: ["set6-137"],
  cardType: "character",
  name: "B.E.N.",
  version: "Eccentric Robot",
  inkType: ["sapphire"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 137,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7dd1be4d36094e6a9429298fb6a2d7df",
    tcgPlayer: 592999,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally", "Robot", "Pirate"],
  abilities: [support],
  i18n: benEccentricRobotI18n,
};
