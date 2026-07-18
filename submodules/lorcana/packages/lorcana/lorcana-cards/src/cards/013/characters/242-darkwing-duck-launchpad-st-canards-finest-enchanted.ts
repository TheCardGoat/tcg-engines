import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckLaunchpadStCanardsFinestEnchantedI18n } from "./242-darkwing-duck-launchpad-st-canards-finest-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";
import { ward } from "../../../helpers/abilities/ward";

export const darkwingDuckLaunchpadStCanardsFinestEnchanted: CharacterCard = {
  id: "nWN",
  canonicalId: "ci_UbM",
  slug: "lorcana-ci_UbM",
  printings: [
    {
      id: "set13-242-enchanted",
      artId: "ci_UbM-enchanted",
      setCode: "set13",
      collectorNumber: "242",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-165"],
  cardType: "character",
  name: "Darkwing Duck & Launchpad",
  version: "St. Canard's Finest",
  inkType: ["sapphire", "steel"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 242,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Ward",
    },
    {
      title: "Victory Pose",
      description:
        "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Team", "Super", "Hero", "Detective"],
  abilities: [
    shift("Darkwing Duck or Launchpad", 5),
    ward,
    {
      type: "triggered",
      name: "VICTORY POSE",
      text: "VICTORY POSE During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "during-turn",
        whose: "your",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: darkwingDuckLaunchpadStCanardsFinestEnchantedI18n,
};
