import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeProvidingBackupI18n } from "./025-nick-wilde-providing-backup.i18n";

export const nickWildeProvidingBackup: CharacterCard = {
  id: "6lX",
  canonicalId: "ci_6lX",
  slug: "lorcana-ci_6lX",
  printings: [
    {
      id: "set14-025",
      artId: "set14-025",
      setCode: "set14",
      collectorNumber: "25",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-025"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Providing Backup",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 25,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0777949fd088446fb7fea975ea0657cd",
  },
  text: [
    {
      title: "I'VE GOT THIS",
      description:
        "While you have another Detective character in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [
    {
      id: "6lX-1",
      name: "I'VE GOT THIS",
      type: "static",
      text: "I'VE GOT THIS While you have another Detective character in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
          filters: [{ type: "has-classification", classification: "Detective" }],
        },
        comparison: { operator: "gte", value: 1 },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "SELF",
      },
    },
  ],
  i18n: nickWildeProvidingBackupI18n,
};
