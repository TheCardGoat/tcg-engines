import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfIngenuity } from "./blessing-of-ingenuity.ts";

export const blessingOfIngenuityI18n = defineFamilyI18n(blessingOfIngenuity, {
  en: {
    name: "Blessing of Ingenuity",
    text: (_parameter, color) =>
      `At the start of your turn, destroy this then put up to ${
        color === "red" ? 3 : color === "yellow" ? 2 : 1
      } Hyper Driver${color === "blue" ? "" : "s"} from your graveyard ${
        color === "blue" ? "or" : "and/or"
      } banished zone into the arena.`,
    typeText: "Mechanologist Action - Aura",
  },
});

export const {
  red: blessingOfIngenuityRedI18n,
  yellow: blessingOfIngenuityYellowI18n,
  blue: blessingOfIngenuityBlueI18n,
} = blessingOfIngenuityI18n.cards;
