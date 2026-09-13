# Game preparation and activation

A registered FAB card pool belongs to the match. Each game has its own
preparation, identified by a reserved game ID, with a turn-order decision and
private selections from that same pool. Unselected cards become inventory;
they are not discarded from the game runtime.

The platform persists preparation on the runtime match. It is a game-scoped
aggregate, not a partially initialized combat state. The rules runtime is
activated only after preparation completes: initialization deals opening hands
and prepares start-of-game rules processing, so running it before the choices
would require undoing rules-visible work. No legal combat commands or opening
hands exist during preparation.

The ordered lifecycle is:

1. Reveal heroes and select the chooser. In game one the server makes one
   random selection and persists it. Following a loss, the loser chooses;
   following a draw the previous chooser retains the entitlement (CR 4.1.3).
2. The chooser selects either seated player to take the first turn. The choice
   and transition are atomic and immutable. A separate 20-second deadline
   randomly selects the first player when unanswered, recording the source as
   `timeout`. The server commits that fallback atomically.
3. Start the full 120-second loadout window. Each player selects equipment and
   starting deck cards (CR 4.1.4–4.1.5). Choices remain private. Bots currently
   choose to go first when entitled, with the source recorded as `bot`.
4. Once both selections lock, materialize the full pool into instance sections:
   hero, selected equipment slots, main deck, and remaining inventory. The
   engine receives the chosen first player and all owned instances. Inventory
   does not enter the deck shuffle or opening hand.

Loadout mutations carry the expected game ID. Redis checks stage, game ID,
seat, deadline and lock state atomically; requests from the previous game cannot
lock the next game's loadout. Choice retries preserve the original deadline.
Cancellation compares the current preparation atomically, so a stale timeout cannot
overwrite a chosen turn order or a newly locked selection. It also updates
historical match status through the management gateway, retrying transient failures;
the bounded runtime preparation record remains available to explain the failure.

Local practice follows the same ordering with a dialog over the sideboard,
preserving its 20-second deadline and turn-order decision
in session storage before engine creation. It materializes the entire pool,
including inventory, and persists the active engine snapshot after activation.
The prepared local practice factory requires an explicit first-player ID.

The shared contract owns the small choosing/chosen union. FAB-specific card
classification, format legality, inventory and initialization remain in the FAB
engine and adapter. Matchmaking and private lobbies use the same server gate.
