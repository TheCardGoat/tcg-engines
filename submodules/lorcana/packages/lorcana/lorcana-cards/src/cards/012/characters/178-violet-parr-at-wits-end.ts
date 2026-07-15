import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities/alert";
import { violetParrAtWitsEndI18n } from "./178-violet-parr-at-wits-end.i18n";

export const violetParrAtWitsEnd: CharacterCard = {
  id: "NsD",
  canonicalId: "ci_NsD",
  slug: "lorcana-ci_NsD",
  printings: [
    {
      id: "set12-178",
      artId: "set12-178",
      setCode: "set12",
      collectorNumber: "178",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-178"],
  cardType: "character",
  name: "Violet Parr",
  version: "At Wits' End",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 178,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  abilities: [alert],
  externalIds: {
    lorcast: "crd_92fe9e279ebd46b5922826303ea92d27",
    tcgPlayer: "692077",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  i18n: violetParrAtWitsEndI18n,
};
