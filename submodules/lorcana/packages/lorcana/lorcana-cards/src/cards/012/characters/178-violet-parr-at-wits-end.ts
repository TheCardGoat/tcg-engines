import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities/alert";
import { violetParrAtWitsEndI18n } from "./178-violet-parr-at-wits-end.i18n";

export const violetParrAtWitsEnd: CharacterCard = {
  id: "NsD",
  canonicalId: "ci_NsD",
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
  externalIds: {
    lorcast: "crd_92fe9e279ebd46b5922826303ea92d27",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [alert],
  i18n: violetParrAtWitsEndI18n,
};
