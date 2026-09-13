import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vileInquisition } from "./vile-inquisition.ts";

export const vileInquisitionI18n = defineFamilyI18n(vileInquisition, {
  en: {
    name: "Vile Inquisition",
    text: ({
      color,
    }) => `You may play this from your banished zone. If you do, it costs {r}{r} less to play.
Target hero banishes the top card of their deck. If it's ${color}, they lose 1{h}.
Blood Debt`,
    typeText: "Shadow Action",
  },
});

export const {
  red: vileInquisitionRedI18n,
  yellow: vileInquisitionYellowI18n,
  blue: vileInquisitionBlueI18n,
} = vileInquisitionI18n.cards;
