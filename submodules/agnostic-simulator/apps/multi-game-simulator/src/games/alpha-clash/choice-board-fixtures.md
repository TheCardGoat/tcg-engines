# Real-card choice board fixtures

Open `/simulator-ui-fixtures/game-interactions/alpha-clash?scenario=board-resources`.
The scenario selector covers all twelve requested interaction families; the variant
selector covers 35 cases. Reset restores the initial board and clears the draft.

These are **local presentation fixtures**, not engine-backed games. They use
printed Alpha Clash records and the same `ArenaScene`, card poses, artwork,
selection rims and inspection motion as the live board. Confirm applies the
specified local preview mutation or records an ordered choice. It does not
prove native effects, legality, state-based defeats, search shuffling, complete
resolution sequences, hosted matches, audio timing or 60 FPS performance.

## Shared input boundary

`@tcg/simulator-presentation/choice-drag` exposes controlled drag sources,
destinations, a bounded value control, draft placement and validation. It has
no Alpha Clash imports. Game adapters supply viewer-safe tokens, legal slot IDs,
limits and callbacks. Keyboard/tap selection uses the same placement function
as pointer drag. Each provider scopes its drop zones; Escape, pointer cancel,
blur, visibility loss, pause and fixture replacement cancel a drag. Pointer
movement updates a ghost transform through a ref, not React state per frame.

The fixture owns local assignments. A live consumer must map assignments into
its existing `InteractionDraft` inputs and submit through its native adapter;
never use fixture mutations as game rules.

## QA expectations

- Resources: illegal colors are rejected; the same resource cannot fill two
  slots. Drafting never moves or engages a resource. Confirm engages it.
- Costs: choosing a route exposes its dependent slots. Additional cost requires
  both resources and the accessory. Changing the route clears dependencies.
- Targets: board hit areas use scene projections. Ordered selections are
  numbered; retargeting moves the same marker rather than duplicating it.
- Options and amount: search only the permitted list; zero is valid; limits
  stay visible and keyboard input works.
- Allocation: distribute all six markers to at most two targets. Incomplete
  allocation cannot confirm. Counter previews display counters on the board.
- Destinations: draft is reversible. Reveal/select do not change a card zone.
- Search: candidates are an explicit permitted deck set. Retrieve uses public
  Oblivion cards. No matches keeps confirmation disabled.
- Foretell: both permitted cards must be placed. Top and Bottom are separately
  ordered; index 1 in Top is the next draw. No subsequent draw is simulated.
- Ordering: moving an entry before another preserves other entries and IDs.
- Optional: Restore uses only the top Oblivion card. Wrath requires the higher
  cost Dragon and opposing target. Temper is optional. Breach the Void has no
  optional payment and therefore has Resolve, not Decline.
- Inspection: cards lift into the existing inspection plane. Public pile order
  stays unchanged; hand ordering changes local presentation only.

Rules checked against [official rulebook 8.0](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf),
sections 704.26, 704.29, 704.32 and 704.34. Printed source text is available in
each fixture. Generic color/name/X/counter and destination control variants do
not assert that the displayed reference card has every demonstrated ability.
