/**
 * Token definitions for One Piece TCG
 * These are special cards that don't exist in physical sets
 */

import type { DonCard } from "../cardTypes";
import { createDonCard } from "../cardTypes";

// Basic DON!! token
export const basicDonToken: DonCard = createDonCard({
  id: "DON-TOKEN-001",
  name: "DON!!",
  set: "TOKEN",
  number: 1,
  rarity: "common",
  colors: [],
  text: "DON!! cards can be given to your Leader or Character cards to increase their power by +1000 during your turn.",
  implemented: true,
});

// Collection of all token cards
export const TOKEN_CARDS = {
  [basicDonToken.id]: basicDonToken,
};
