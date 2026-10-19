import type { OpeningBeat } from "@tcg/simulator-presentation/opening";

export function openingReview(localCount: number, rivalCount: number): OpeningBeat {
  return {
    id: "hand",
    title: "Your opening hand",
    detail: "Choose whether to keep your hand.",
    leaders: "field",
    hand: "review",
    localCount,
    rivalCount,
    action: "hand",
  };
}
export function openingIntro(
  local: number,
  rival: number,
  starter: string,
): readonly OpeningBeat[] {
  const hidden = {
    ...openingReview(local, rival),
    hand: "deck" as const,
    localCount: 0,
    rivalCount: 0,
    action: undefined,
  };
  return [
    {
      ...hidden,
      id: "contenders",
      leaders: "showcase",
      title: "Meet your contenders",
      detail: starter,
      duration: 1700,
      cue: "card.reveal",
    },
    { ...hidden, id: "dock", title: "Meet your contenders", detail: starter, duration: 1050 },
    {
      ...hidden,
      id: "shuffle",
      title: starter,
      detail: "Preparing the opening hands.",
      duration: 800,
      cue: "deck.shuffle",
    },
    {
      ...openingReview(local, rival),
      id: "deal",
      detail: "Your opening hand.",
      duration: 1800,
      action: undefined,
    },
  ];
}
export function openingReplacement(
  local: number,
  rival: number,
  count: number,
): readonly OpeningBeat[] {
  const base = { ...openingReview(local, rival), action: undefined };
  return [
    {
      ...base,
      id: "return",
      hand: "return",
      title: `Returning ${count} ${count === 1 ? "card" : "cards"}`,
      detail: "Unselected cards stay in your hand.",
      duration: 950,
      cue: "card.move",
    },
    {
      ...base,
      id: "reshuffle",
      hand: "return",
      title: "Shuffling your deck",
      detail: "Preparing your replacement cards.",
      duration: 550,
      cue: "deck.shuffle",
    },
    {
      ...base,
      id: "redraw",
      replacement: true,
      title: "Your final opening hand",
      detail: `Drawing ${count} replacement ${count === 1 ? "card" : "cards"}.`,
      duration: 1800,
    },
  ];
}
export function openingSettle(local: number, rival: number, starter: string): OpeningBeat {
  return {
    ...openingReview(local, rival),
    id: "settle",
    title: starter,
    detail: "The opening is complete.",
    hand: "table",
    action: undefined,
    duration: 1000,
    cue: "turn.change",
  };
}
