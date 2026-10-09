import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities";
import { kitCloudkickerSureShotI18n } from "./192-kit-cloudkicker-sure-shot.i18n";

export const kitCloudkickerSureShot: CharacterCard = {
  id: "zac",
  canonicalId: "ci_zac",
  slug: "lorcana-ci_zac",
  printings: [
    {
      id: "set14-192",
      artId: "set14-192",
      setCode: "set14",
      collectorNumber: "192",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-192"],
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Sure Shot",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 192,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_04d549bf71c24aa2a30c612d5d9947c5",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "AERIAL ACROBATICS",
      description: "Whenever this character quests, choose one:",
    },
    {
      title: "• Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
    {
      title: "• Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    shift(3),
    {
      id: "kit-sure-shot-1",
      name: "AERIAL ACROBATICS",
      type: "triggered",
      text: "AERIAL ACROBATICS Whenever this character quests, choose one: Get 1 ink drop. Or deal 1 damage to chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "choice",
        optionLabels: ["Get 1 ink drop.", "Deal 1 damage to chosen character."],
        options: [
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: kitCloudkickerSureShotI18n,
};
