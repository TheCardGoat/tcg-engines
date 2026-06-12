import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelHighClimberI18n } from "./101-rapunzel-high-climber.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const rapunzelHighClimber: CharacterCard = {
  id: "RZ1",
  canonicalId: "ci_jRy",
  reprints: ["set8-101"],
  cardType: "character",
  name: "Rapunzel",
  version: "High Climber",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "008",
  cardNumber: 101,
  rarity: "legendary",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cf079ada81bd48cdb9290647f227982c",
    tcgPlayer: 633103,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "WRAPPED UP",
      description:
        "Whenever this character quests, chosen opposing character can't quest during their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-quest",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "restriction",
      },
      id: "1ob-2",
      name: "WRAPPED UP",
      text: "WRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelHighClimberI18n,
};
