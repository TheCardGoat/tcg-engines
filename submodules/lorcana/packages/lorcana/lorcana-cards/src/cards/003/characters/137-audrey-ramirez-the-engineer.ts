import type { CharacterCard } from "@tcg/lorcana-types";
import { audreyRamirezTheEngineerI18n } from "./137-audrey-ramirez-the-engineer.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const audreyRamirezTheEngineer: CharacterCard = {
  id: "2j6",
  canonicalId: "ci_2j6",
  reprints: ["set3-137"],
  cardType: "character",
  name: "Audrey Ramirez",
  version: "The Engineer",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 137,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ac107df1d3864416ac579de7b826d297",
    tcgPlayer: 536269,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "SPARE PARTS",
      description: "Whenever this character quests, ready one of your items.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      effect: {
        target: {
          cardTypes: ["item"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "ready",
      },
      id: "csd-2",
      name: "SPARE PARTS",
      text: "SPARE PARTS Whenever this character quests, ready one of your items.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: audreyRamirezTheEngineerI18n,
};
