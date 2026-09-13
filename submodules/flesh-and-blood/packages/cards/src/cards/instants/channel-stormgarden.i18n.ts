import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { channelStormgarden } from "./channel-stormgarden.ts";

export const channelStormgardenI18n = defineFamilyI18n(channelStormgarden, {
  en: {
    name: "Channel Stormgarden",
    typeText: "Lightning Instant - Aura",
    text: "When this enters the arena, create a Lightning Flow token.\nThe first time you destroy a Lightning Flow each turn, amp 1.\nChannel Lightning - At the beginning of your end phase, put a flow counter on this, then destroy it unless you put a Lightning card from your pitch zone on the bottom of your deck for each flow counter on it.",
  },
});
export const { yellow: channelStormgardenYellowI18n } = channelStormgardenI18n.cards;
