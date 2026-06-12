import type { CharacterCard } from "@tcg/lorcana-types";
import { angusMightyHorseI18n } from "./174-angus-mighty-horse.i18n";

export const angusMightyHorse: CharacterCard = {
  id: "4N8",
  canonicalId: "ci_4N8",
  reprints: ["set12-174"],
  cardType: "character",
  name: "Angus",
  version: "Mighty Horse",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 174,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Dauntless",
      description:
        "When you play this character, chosen character gains <Alert> this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "4N8-1",
      name: "DAUNTLESS",
      type: "triggered",
      text: "DAUNTLESS When you play this character, chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: angusMightyHorseI18n,
};
