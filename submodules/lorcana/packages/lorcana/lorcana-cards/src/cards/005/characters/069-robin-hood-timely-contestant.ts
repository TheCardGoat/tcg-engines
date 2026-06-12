import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodTimelyContestantI18n } from "./069-robin-hood-timely-contestant.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const robinHoodTimelyContestant: CharacterCard = {
  id: "LKY",
  canonicalId: "ci_LKY",
  reprints: ["set5-069"],
  cardType: "character",
  name: "Robin Hood",
  version: "Timely Contestant",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 69,
  rarity: "rare",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_e563c6bf2df446f5b77fbf41d3d3b30a",
    tcgPlayer: 557730,
  },
  text: [
    {
      title: "TAG ME IN!",
      description:
        "For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
    },
    {
      title: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "rhk-1",
      name: "TAG ME IN!",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "reducer",
          reducer: "damage",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [{ type: "damaged" }],
        },
      },
      sourceZones: ["hand"],
      type: "static",
      text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
    },
    ward,
  ],
  i18n: robinHoodTimelyContestantI18n,
};
