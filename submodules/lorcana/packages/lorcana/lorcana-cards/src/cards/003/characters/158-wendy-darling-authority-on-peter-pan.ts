import type { CharacterCard } from "@tcg/lorcana-types";
import { wendyDarlingAuthorityOnPeterPanI18n } from "./158-wendy-darling-authority-on-peter-pan.i18n";
import { support } from "../../../helpers/abilities/support";
import { ward } from "../../../helpers/abilities/ward";

export const wendyDarlingAuthorityOnPeterPan: CharacterCard = {
  id: "DdB",
  canonicalId: "ci_DdB",
  reprints: ["set3-158"],
  cardType: "character",
  name: "Wendy Darling",
  version: "Authority on Peter Pan",
  inkType: ["sapphire"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 158,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_43915110e8b94147baf492d89356e0ca",
    tcgPlayer: 531826,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [ward, support],
  i18n: wendyDarlingAuthorityOnPeterPanI18n,
};
