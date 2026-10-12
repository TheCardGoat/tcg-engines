import { costRouteFixtures } from "./cost-route-fixture-catalog";
/** Metadata only: safe to import in the route without loading a game engine. */
export const alphaClashPromptFixtures = [
  ...costRouteFixtures,
  {
    id: "prompt-oblivion-return",
    title: "Clarity · Return from Oblivion",
    description:
      "Attack with Clarity, Ready for Trials, resolve Foretell and the revealed card, then choose a legal Clash from Oblivion. One card click puts it on top of the deck.",
  },
  {
    id: "prompt-bombardment",
    title: "Bombardment · Diminish amount",
    description:
      "Play Bombardment, choose an opposing Clash, then pass responses. Click an amount from 0–3 to diminish cards and resolve the native damage.",
  },
  {
    id: "prompt-health-payment",
    title: "From Life to Death · Health payment",
    description:
      "Attack with Sonoro, then counter with From Life to Death. Choose 0–4 health, then a target. Cancel and retry before playing; pass the response window to resolve the real card.",
  },
  {
    id: "prompt-target-change",
    title: "Target List · Declare a target",
    description:
      "Play Target List from hand, then click an opposing Clash to declare the Bounty Counter target. Single-target declarations submit on selection; ordered and multi-target prompts keep their confirm step.",
  },
  {
    id: "prompt-number",
    title: "Mean-Streak · Counter amount",
    description:
      "Play Mean-Streak, Newfound Powers and pass responses to create two Streak Counters. Activate your Contender, choose Newfound Powers then Magnate, and choose how many counters to move.",
  },
  {
    id: "prompt-targets",
    title: "Mean-Streak · Card selections",
    description:
      "Play Mean-Streak, Newfound Powers to create its counters. Activate the Contender, then choose the source Clash, a different destination Clash, and counter amount.",
  },
  {
    id: "prompt-modes",
    title: "Haven · Choose a mode",
    description:
      "Play Haven from hand, pass its response window, then choose health or a card draw.",
  },
  {
    id: "prompt-optional",
    title: "Denver · Optional draw and discard",
    description:
      "Play Denver from hand, pass its response window, then accept or decline its trigger. Accepting draws two cards and opens discard.",
  },
  {
    id: "prompt-alternate-cost",
    title: "Cao Ling · Alternative cost",
    description:
      "Play Cao Ling from hand: pay its five-resource cost, or send a Clash card costing five or more to Oblivion instead.",
  },
  {
    id: "prompt-foretell",
    title: "Clarity · Order the top cards",
    description:
      "Activate Clarity during Primary Phase, then order the top three cards. The engine draws the first card.",
  },
  {
    id: "prompt-foretell-draw-step",
    title: "Clarity · Draw-step Foretell",
    description:
      "End Player 2’s turn, then accept Clarity's draw-step trigger, then place the two permitted cards in Top and Bottom groups, order each group, and confirm. The engine draws the next card.",
  },
  {
    id: "prompt-barrage",
    title: "Machina · Divide damage",
    description:
      "Initiate a clash with Machina, then complete or decline its native Barrage allocation.",
  },
  {
    id: "prompt-play",
    title: "Haven · Play from hand",
    description:
      "Play Haven from hand through the normal game controls. Pay its cost, pass the response window, then choose its enter mode.",
  },
] as const;

export function isAlphaClashPromptFixture(id: string | undefined) {
  return alphaClashPromptFixtures.some((fixture) => fixture.id === id);
}

/** Retire the board mockups. Unsupported cases return to the real fixture index. */
export function alphaClashNativeFixturePath(scenario: string): string | undefined {
  if (isAlphaClashPromptFixture(scenario)) return `/alpha-clash/simulator/tests/${scenario}`;
  const fixtures: Record<string, string> = {
    "board-costs": "prompt-cost-routes",
    count: "prompt-number",
    modal: "prompt-modes",
    option: "prompt-optional",
    target: "prompt-targets",
    division: "prompt-barrage",
    "resource-step": "resource-step",
    "board-resources": "prompt-play",
    "board-number": "prompt-number",
    "board-targets": "prompt-targets",
    "board-options": "prompt-modes",
    "board-optional": "prompt-optional",
    "board-destination": "prompt-optional",
    "board-foretell": "prompt-foretell",
    "board-allocation": "prompt-barrage",
    "board-inspect": "prompt-play",
  };
  const fixture = fixtures[scenario];
  if (fixture) return `/alpha-clash/simulator/tests/${fixture}`;
  if (scenario.startsWith("board-")) return "/alpha-clash/simulator/tests";
  return undefined;
}
