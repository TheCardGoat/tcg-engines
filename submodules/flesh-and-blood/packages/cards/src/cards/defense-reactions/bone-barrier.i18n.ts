import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boneBarrier } from "./bone-barrier.ts";

export const boneBarrierI18n = defineFamilyI18n(boneBarrier, {
  en: {
    name: "Bone Barrier",
    typeText: "Necromancer Defence Reaction",
    text: "When this defends, you may destroy an ally you control or discard an ally. If you do, this gets +2{d}.",
  },
});

export const { blue: boneBarrierBlueI18n } = boneBarrierI18n.cards;
