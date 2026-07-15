import type { CharacterCard } from "@tcg/lorcana-types";
import { sulleyProtectiveMonsterI18n } from "./128-sulley-protective-monster.i18n";

export const sulleyProtectiveMonster: CharacterCard = {
  id: "hUj",
  canonicalId: "ci_hUj",
  slug: "lorcana-ci_hUj",
  printings: [
    {
      id: "set13-128",
      artId: "set13-128",
      setCode: "set13",
      collectorNumber: "128",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-128"],
  cardType: "character",
  name: "Sulley",
  version: "Protective Monster",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 128,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Fearsome Glare",
      description: "When you play this character, you may exert all cards in your inkwell.",
    },
    {
      title: "Riled Up",
      description:
        "While all cards in your inkwell are exerted, this character gains Rush. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    {
      id: "hUj-1",
      name: "FEARSOME GLARE",
      type: "triggered",
      text: "FEARSOME GLARE When you play this character, you may exert all cards in your inkwell.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["inkwell"],
          },
        },
      },
    },
    {
      id: "hUj-2",
      name: "RILED UP",
      type: "static",
      text: "RILED UP While all cards in your inkwell are exerted, this character gains Rush.",
      condition: {
        type: "resource-count",
        what: "ready-cards-in-inkwell",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
      },
    },
  ],
  i18n: sulleyProtectiveMonsterI18n,
};
