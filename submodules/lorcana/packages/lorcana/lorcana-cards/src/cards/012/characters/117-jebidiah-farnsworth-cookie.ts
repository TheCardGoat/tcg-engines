import type { CharacterCard } from "@tcg/lorcana-types";
import { jebidiahFarnsworthCookieI18n } from "./117-jebidiah-farnsworth-cookie.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { reckless } from "../../../helpers/abilities/reckless";

export const jebidiahFarnsworthCookie: CharacterCard = {
  id: "yHb",
  canonicalId: "ci_yHb",
  reprints: ["set12-117"],
  cardType: "character",
  name: "Jebidiah Farnsworth",
  version: "Cookie",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 117,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a23919b34154ff4b95eed8eb15dbfa4",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Reckless",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [evasive, reckless],
  i18n: jebidiahFarnsworthCookieI18n,
};
