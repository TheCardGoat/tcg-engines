import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaDeterminedExplorerI18n } from "./177-raya-determined-explorer.i18n";

export const rayaDeterminedExplorer: CharacterCard = {
  id: "VHh",
  canonicalId: "ci_VHh",
  slug: "lorcana-ci_VHh",
  printings: [
    {
      id: "set14-177",
      artId: "set14-177",
      setCode: "set14",
      collectorNumber: "177",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-177"],
  cardType: "character",
  name: "Raya",
  version: "Determined Explorer",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "014",
  cardNumber: 177,
  rarity: "rare",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "To the Ends of the Realm",
      description: "This character gets +1 {L} for each location you have in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "VHh-1",
      name: "To the Ends of the Realm",
      type: "static",
      text: "To the Ends of the Realm This character gets +1 {L} for each location you have in play.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "for-each",
          counter: "locations",
        },
        target: "SELF",
      },
    },
  ],
  i18n: rayaDeterminedExplorerI18n,
};
