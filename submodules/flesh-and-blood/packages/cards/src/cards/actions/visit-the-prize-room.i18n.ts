import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { visitThePrizeRoom } from "./visit-the-prize-room.ts";

export const visitThePrizeRoomI18n = defineFamilyI18n(visitThePrizeRoom, {
  en: {
    name: "Visit the Prize Room",
    typeText: "Warrior Action",
    text: "Olympia Specialization\nYou may destroy a Gold you control. If you do, equip a Prized Galea from your inventory.\nCreate a Vigor and a Courage token. Go again",
  },
});

export const { blue: visitThePrizeRoomBlueI18n } = visitThePrizeRoomI18n.cards;
