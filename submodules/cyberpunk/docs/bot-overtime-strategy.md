# Bot decisions near overtime

## Rule basis

[Cyberpunk comprehensive rules](https://cyberpunktcg.com/comprehensive-rules),
sections 1.10–1.11, 8.6.3, 9.21, and 9.23.2:

- Outside overtime, seven Gigs win at the start of the owner's turn.
- Overtime starts after two consecutive turns that each began with both Fixer
  areas empty. Use the engine's turn flags, not a fixed turn number or seat.
- Seven Gigs win immediately during overtime, including when overtime starts.
- A BLOCKER redirects a direct attack into a fight. Defeating that BLOCKER does
  not also steal Gigs in that attack.
- A direct attack with 10–19 power normally steals two Gigs.

## Tactical objective

`search/gig-race.ts` evaluates the current turn's win boundary:

| State | Main objective |
| --- | --- |
| First turn that began with both Fixer areas empty | Build a lead that survives the rival's next turn. Compare removal, scoring, and retaining ready BLOCKERs. |
| Second consecutive such turn | Reach seven and end the turn. Units may be sacrificed to open scoring attacks. There is no need to defend a turn that will never occur. |
| Overtime | Reach seven now, or deny the rival's winning attack when reacting. |

The normal combat policy can force profitable attacks and exclude losing
fights. Those filters are disabled for this final Gig race so the search can
compare passing, keeping a BLOCKER ready, and sacrifice attacks.

The public-board estimate subtracts one attack per ready BLOCKER, starting with
the largest steal. A weak BLOCKER can still deny a winning attack. On the first
empty-Fixer turn, the estimate readies rival attackers for their next turn.
Equal protected scores use the normal material evaluation as a tie breaker.
Thus removing a one-Gig attacker can beat stealing one Gig, while stealing two
can provide a better score buffer.

On large boards, the search considers passing and high-value steals early and
reserves part of its node budget for their continuations. Engine-confirmed wins
outrank forecasts. Hidden draws and random die outcomes remain search cutoffs.

This remains a bounded heuristic. The forecast does not know hidden hands or
solve every sequence of card effects. The engine resolves the actual commands,
combat, choices, and win conditions.

## Reported match

The supplied public log for game
`cyberpunk-game-fc4a8a9e-cf03-407a-9c29-c558068a3d2f` shows the bot stealing one
Gig each with its smaller attackers, reaching 6–6, then passing with its
10-power attacker ready. The opposing ready Augmented Negotiators could block
that attack. Therefore the attack was not a guaranteed two-Gig steal: the
defender could sacrifice the BLOCKER to keep the score tied.

The regression reconstructs that public combat situation and confirms that the
bot attacks and removes the BLOCKER if blocked. It does not reproduce the full
hidden state or all card effects. The supplied log contains no candidate scores,
so it cannot establish the exact reason for the historical production choice.

## Regression coverage

`packages/engine/tests/automation/tactical-overtime.test.ts` drives the shipped
tactical chooser through the public test engine, with automatic combat
progression. It covers:

- The reported 6–6 combat situation with a real blocking response.
- Passing at seven to win when overtime starts, including crowded boards.
- A two-Gig winning steal on a crowded board.
- Spending the last friendly BLOCKER to reach seven on the final turn.
- Sacrificing Units into stronger BLOCKERs to open winning steals.
- Keeping a BLOCKER and removing attackers on the earlier turn.
- Taking two Gigs when that protects a better score than removal.
- Immediate overtime victory and defensive sacrifice blocks.
- Saving a BLOCKER for a larger, decisive attack.
