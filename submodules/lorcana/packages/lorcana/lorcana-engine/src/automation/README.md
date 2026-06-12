# Automation in the Lorcana Engine

This folder contains the code that lets the engine play a turn by itself.

The short version:

- The bot does **not** "think" like a person.
- It does **not** learn by itself.
- It works by:
  1. figuring out who is supposed to act,
  2. listing the legal things that player can do,
  3. sorting those legal options with a strategy,
  4. trying the best option first.

If you are new here, that is the main idea to keep in mind.

## What "automation" means here

In this codebase, "automation" means "have the engine choose and perform a legal move without a human clicking through every step."

That includes small setup choices, like:

- choosing who goes first,
- deciding what to mulligan,

and also normal in-game choices, like:

- questing,
- challenging,
- putting a card into the inkwell,
- playing a card,
- activating an ability,
- resolving pending prompts.

## The basic flow

The core flow lives in [planner.ts](./planner.ts), with helper files around it.

### 1. Find the current actor

Before the bot can do anything, it has to know **which player is supposed to act right now**.

On a player-scoped engine, that is easy: the actor is the player attached to that engine surface.

On the server-scoped engine, [actor-resolution.ts](./actor-resolution.ts) checks a few things in order:

- an active pending effect chooser,
- the next bag resolver,
- the choose-first-player prompt,
- the mulligan order,
- the current priority holder.

If none of those tell us who should act, automation stops and reports that it could not resolve an actor.

### 2. Build legal candidates

Once the actor is known, the planner builds a list of **candidates**.

A candidate is just "one legal thing the bot could try next."

Examples:

- "choose player one to go first"
- "mulligan these two cards"
- "put this card into the inkwell"
- "quest with this character"
- "challenge with this attacker into that defender"
- "play this card using sing"
- "resolve this pending effect and choose target X"

The supported candidate families are defined in [types.ts](./types.ts), and the planner currently knows how to build candidates for:

- `chooseWhoGoesFirst`
- `alterHand`
- `resolveBag`
- `resolveEffect`
- `putCardIntoInkwell`
- `playCard`
- `activateAbility`
- `quest`
- `challenge`
- `moveCharacterToLocation`

Important detail: the planner does not blindly invent moves. It still runs each candidate through engine validation before keeping it.

### 3. Rank the candidates with a strategy

After that, the candidates are sorted by a **strategy**.

A strategy does not create new moves. It only says:

"Out of these already-legal moves, which one should come first?"

The registry for selectable strategies is in [strategy-registry.ts](./strategy-registry.ts).

The engine currently ships with these strategies:

| Strategy id                          | What it tries to do                                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `deck-aware-lore-race` **(default)** | Uses deck color, matchup, and per-card weighting for mulligans, inking, and target selection.                              |
| `best-deck-aware-lore-race`          | Fair-information candidate that uses typed deck dossiers and card rules without hidden opponent deck access.               |
| `best-deck-aware-oracle-lore-race`   | Oracle variant that allows full opponent deck knowledge through the typed rule system.                                     |
| `board-control-lore-race`            | Still wants lore, but is more willing to trade tempo to remove opposing threats and spend ink on stable board development. |
| `aggressive-board-control-lore-race` | Pushes harder into value trades and mutual-banish challenges to break opposing boards.                                     |

The main ranking logic for the default strategy lives in [deck-aware-strategy.ts](./deck-aware-strategy.ts), with shared family heuristics in [strategy/](./strategy/). The board-control and aggressive-board-control variants use [default-strategy.ts](./default-strategy.ts).

### 4. Try the candidates in order

When you call `takeAutomatedAction`, the engine tries the sorted candidates one by one.

- If the first one succeeds, it stops there.
- If one fails during execution, it tries the next one.
- By default, it will stop after 3 failed execution attempts.
- If nothing succeeds, it falls back to `passTurn`.
- If even `passTurn` fails, it falls back to `concede`.

That execution behavior is also handled in [planner.ts](./planner.ts).

## What the current strategies actually prefer

The current strategies are simple and very code-driven. They are not hidden behind magic.

Here are the big ideas in the current default behavior:

### Setup choices

- When choosing who goes first, the bot prefers choosing itself.
- During mulligan, it builds three plans:
  - keep everything,
  - a "structural mulligan" that throws back expensive or non-inkable cards,
  - mulligan the full hand.
- If the opening hand already looks playable enough, the default strategy leans toward keeping it.

### Questing

- Quest candidates are ranked higher when the character has more lore.

### Playing cards

- Simpler plays are preferred over more complicated plays.
- The default lore-race strategy tends to like stronger card development that still pushes tempo.
- The board-control strategy is more willing to spend current ink on a clean permanent play instead of just inking and passing.

### Inking

- The bot prefers inking duplicate cards first.
- After that, it usually prefers lower-cost cards.
- If cost is tied, it tends to prefer inking lower-lore cards.

### Challenging

- The bot likes challenges more when they remove an opposing lore threat.
- It likes them even more when the defender is banished and the attacker survives.
- The board-control strategy is more willing than the default strategy to challenge before questing when the opponent's board is becoming dangerous.

### Activated abilities

- Simpler ability uses are preferred over more complicated ones.
- The planner can also build legal cost combinations for abilities that ask you to exert, banish, or discard cards.

## What the planner can and cannot handle today

The planner is intentionally bounded. That is a good thing.

Without limits, some effects would explode into too many target combinations and become slow or impossible to reason about.

### Things it handles well today

- regular legal move listing,
- target selection when the target pool is still reasonably small,
- optional yes/no choices,
- single choice branches,
- card play modes like standard play, free play, shift, sing, and sing together,
- ability costs that require specific cards to be exerted, banished, or discarded.

### Things it currently skips or limits

Today the planner will skip some shapes on purpose and record a diagnostic instead of guessing.

Examples include:

- "name a card" prompts,
- ordered destination choices, such as scry-style destination ordering,
- very large target pools or too many combinations,
- deeply nested branching,
- some unusually complex multi-step play patterns.

There is another practical limit too: search caps.

Those caps live in [types.ts](./types.ts) and are used by the planner to keep target pools, target combinations, choice counts, singer combinations, and pending items inside a safe search budget.

So if a move is technically legal but creates too many combinations, the planner may skip it for now instead of trying to brute-force everything.

## The most useful files in this folder

If you want to understand or change automation, these are the best starting points:

| File                                                     | Why it matters                                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [types.ts](./types.ts)                                   | Shared types for candidates, strategies, traces, diagnostics, and limits.               |
| [planner.ts](./planner.ts)                               | The main planner and executor. This is where legal candidates are built and tried.      |
| [deck-aware-strategy.ts](./deck-aware-strategy.ts)       | The current default strategy. 5-axis scoring with deck profiles and card rules.         |
| [deck-profile.ts](./deck-profile.ts)                     | Color pair profiles, role weights, opening plans, and matchup modifiers.                |
| [strategy-data/](./strategy-data/)                       | Card-level rules and matchup plans that feed into the deck-aware strategy.              |
| [default-strategy.ts](./default-strategy.ts)             | Legacy ranking rules for board-control and aggressive-board-control variants.           |
| [strategy-registry.ts](./strategy-registry.ts)           | The list of strategies that can be selected by id.                                      |
| [strategy/](./strategy/)                                 | Shared family evaluators (challenge, quest, play-card, etc.) and the strategy composer. |
| [actor-resolution.ts](./actor-resolution.ts)             | How the server figures out which player should act.                                     |
| [target-priority.ts](./target-priority.ts)               | Scores card targets for effects based on role weights and board state.                  |
| [move-adapter.ts](./move-adapter.ts)                     | Turns a chosen candidate into a real engine move request.                               |
| [decision-trace.ts](./decision-trace.ts)                 | Builds stable snapshots and fingerprints for debugging and analysis.                    |
| [automated-actions.test.ts](./automated-actions.test.ts) | Best place to see concrete examples of current behavior.                                |
| [REFINEMENT_PROMPT.md](./REFINEMENT_PROMPT.md)           | Complete guide for improving strategy quality with tests and simulations.               |

## How to improve an existing strategy

If you want to make a strategy better, the safest path is:

1. Read [deck-aware-strategy.ts](./deck-aware-strategy.ts) and the [strategy/](./strategy/) family evaluators to understand the current ordering.
2. Add or update focused tests in [automated-actions.test.ts](./automated-actions.test.ts).
3. Use decision traces to see what the bot considered, what it picked, and what failed.
4. Make a small, explainable change.
5. Compare the result in deterministic AI-vs-AI simulations.

The most common improvement is adding card-level rules in [strategy-data/cards.ts](./strategy-data/cards.ts) or matchup plans in [strategy-data/matchups.ts](./strategy-data/matchups.ts). These tune the deck-aware strategy without touching evaluator code. See [REFINEMENT_PROMPT.md](./REFINEMENT_PROMPT.md) Section 7 for a guide.

There is already project guidance pointing in that direction:

- [REFINEMENT_PROMPT.md](./REFINEMENT_PROMPT.md)
- [strategy-iteration.ts](../../lorcana-simulator/src/testing/ai-strategy/strategy-iteration.ts)
- [strategy-suite.ts](../../lorcana-simulator/src/testing/ai-strategy/strategy-suite.ts)
- [simulate-game.test.ts](../../lorcana-simulator/src/testing/ai-strategy/simulate-game.test.ts)

Good improvements are usually:

- small,
- easy to explain,
- covered by tests,
- measured against a baseline.

Less good improvements are usually:

- giant rewrites,
- "it feels smarter now" changes with no tests,
- changes that make traces harder to read,
- changes that only help one flashy case but make many normal turns worse.

## How to create your own strategy

The nice part is that you do **not** need to rewrite the planner.

Most of the time, you only need a new strategy that reorders the candidates differently.

At the type level, a strategy looks like this:

```ts
import type { AutomatedActionStrategy } from "./types";

export const myStrategy: AutomatedActionStrategy = {
  name: "my-strategy",
  summarizeCandidates(_context, candidates) {
    return candidates.map((candidate, index) => ({
      candidate,
      family: candidate.family,
      heuristics: [],
      stableKey: `${candidate.family}-${index}`,
    }));
  },
};
```

That example does nothing yet. It just returns the candidates unchanged with empty heuristics.

To make it useful:

1. Copy the candidate array.
2. Sort it in a deterministic way.
3. Return ordered candidate summaries with stable keys and heuristics.

Practical tips:

- Start small. Reorder one family of moves first.
- Keep tie-breakers deterministic so tests stay stable.
- Do not create illegal moves in the strategy. The planner already gave you legal candidates.
- Use the `context` object when you need board state, phase, turn number, or actor information.
- If you want rich trace output like the default strategy has, mirror the summary pattern used in [default-strategy.ts](./default-strategy.ts).

After you create the strategy:

1. export it,
2. register it in [strategy-registry.ts](./strategy-registry.ts),
3. add tests,
4. run simulation comparisons before treating it as better.

## How to debug "why did the bot do that?"

The best answer is usually the decision trace.

The trace system records things like:

- who the actor was,
- a board snapshot,
- the ordered candidate list,
- ranking hints for the default strategy,
- execution attempts,
- fallback behavior,
- diagnostics for skipped or rejected options.

That trace support is described in [types.ts](./types.ts) and built in [decision-trace.ts](./decision-trace.ts) and [planner.ts](./planner.ts).

If a bot choice looks strange, check:

1. whether the move you expected was even enumerated,
2. whether it was rejected by validation,
3. whether it was skipped because the shape is unsupported,
4. where it landed in the sorted list,
5. whether a higher-ranked move failed and forced fallback behavior.

## A simple mental model

If you remember nothing else, remember this:

> The bot is a legal move lister plus a sorter.

That is the system.

It first finds legal options, then a strategy decides the order.

## Glossary

### Actor

The player who is supposed to make the next choice right now.

### Bag

A queue-like place where triggered ability work can wait until it is ready to resolve.

### Candidate

One legal action the bot could try next.

### Diagnostic

A note explaining why something was skipped, rejected, or resolved a certain way.

### Fallback

What the engine does if none of the planned candidates succeed. Right now that means trying `passTurn`, then `concede`.

### Heuristic

A simple ranking rule. Example: "prefer a challenge that banishes a high-lore defender."

### Lore race

A strategy style that mainly tries to win by pushing lore quickly instead of spending many turns trading pieces.

### Mulligan

The opening-hand step where you choose which cards to throw back and redraw.

### Pending effect

A game effect that is waiting for a player choice before it can finish.

### Priority

The game's current right to act. In simple terms: which player gets to do something next when no earlier prompt is blocking.

### Search cap

A safety limit that stops automation from trying too many targets or combinations at once.

### Strategy

The code that sorts legal candidates from "try this first" to "try this later."

### Trace

A debugging record of what the bot saw, what it ranked, what it tried, and what happened.
