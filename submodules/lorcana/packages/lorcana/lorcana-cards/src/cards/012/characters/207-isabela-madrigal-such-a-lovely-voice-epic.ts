import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalSuchALovelyVoiceEpicI18n } from "./207-isabela-madrigal-such-a-lovely-voice-epic.i18n";
import { isabelaMadrigalSuchALovelyVoice } from "./016-isabela-madrigal-such-a-lovely-voice";

export const isabelaMadrigalSuchALovelyVoiceEpic: CharacterCard = {
  ...isabelaMadrigalSuchALovelyVoice,
  id: "SIy",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
  i18n: isabelaMadrigalSuchALovelyVoiceEpicI18n,
};
