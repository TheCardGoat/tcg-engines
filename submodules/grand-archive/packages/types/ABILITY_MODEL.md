# Grand Archive executable ability model

This package defines the authoring language that a future rules engine will
interpret. It is Grand Archive-native: the FaB implementation was used as an
architectural reference for closed unions, bindings, event observation, and
continuous-effect compilation, but none of its combat-chain, pitch, arsenal,
hero, or reaction concepts are part of this model.

## Catalog audit

The design was checked against every default and flip face in the generated
official Index snapshot: 2,495 canonical cards, 2,517 faces, 2,500 text-bearing
faces, and 4,536 paragraph-separated rules blocks. The corpus includes 466
activated-looking blocks, 1,350 trigger-looking blocks, 710 static-looking
blocks, and 252 replacement-looking blocks. These categories overlap because
one paragraph can create a trigger, a replacement, and a duration-bound effect.

Important grammar observed across the complete corpus includes targets and
resolution-time choices; exact, up-to, any-number, random, and distributed
selections; optional all-or-nothing instructions; additional and alternative
costs; modes; event and intervening conditions; “for each” and repeated
instructions; delayed/reflexive triggers; copying; prevention/replacement;
activation, materialization, summon, generate, and transform; reserve, memory,
graveyard, banishment, intent, field, and Effects Stack movement; counters;
continuous durations; and rule/play permissions.

The audit establishes vocabulary coverage, not automatic semantic parsing.
Generated catalog cards remain `GrandArchiveUnparsedAbility` until each printed
paragraph has an executable definition. That makes it impossible for an engine
to silently treat prose as implemented behavior.

## Rules-driven boundaries

- `activated`, `triggered`, and `static` are the three Comprehensive Rules
  ability classes. `card-resolution` is explicitly an engine declaration for
  instructions performed by a resolving activation/materialization, not a
  fourth rules ability class.
- Targets are announced before legality and cost payment and are rechecked on
  resolution. Choices are made during resolution. The two have distinct types.
- Exact target counts are required. `up-to` and `any-number` target counts are
  optional; this gives the resolver enough information to apply the whole-
  ability fizzle rule only when a required target becomes illegal.
- Modes record whether they are chosen during announcement, when a trigger is
  put on the Effects Stack, or during resolution. This preserves the different
  timing rules for ordinary and state-dependent triggered modes.
- Static restrictions and inline restrictions are separate. An engine checks
  the former during announcement and carries them with the stack item; it checks
  the latter while resolving their instruction.
- Replacement effects observe proposed events before commit. Triggered effects
  observe committed events during state-based checks. This boundary prevents a
  replacement from accidentally behaving like a trigger.
- Continuous effects identify both their A–E layer and whether their affected
  set is dynamic (static wording such as “have/are”) or locked when instanced
  (wording such as “get/gain/become”). Duration, timestamp, and dependency
  ordering can therefore be implemented without reparsing card text.
- Bindings connect declared targets, paid costs, trigger event subjects, and
  earlier committed results to later “it”, “that card”, “that many”, and “if
  you do” instructions. Mutable engine instance IDs never belong in card data.

## Intended engine pipeline

1. **Admission:** reject any card face containing `unparsed` abilities in an
   executable match format.
2. **Discovery:** use functional zones and static restrictions to expose legal
   activations/materializations.
3. **Announcement:** choose variables, modes, and targets; quote all base,
   additional, alternative, and modified costs; run legality checks.
4. **Payment and commit:** pay the selected cost atomically and create an
   immutable stack item containing source last-known information and bindings.
5. **Event processing:** pass proposed events through ordered replacement
   effects, commit them, then match triggered abilities during state-based
   checks.
6. **Resolution:** execute the effect tree in printed order, suspending only for
   typed player choices, and record each committed result in its binding.
7. **Reconciliation:** compile static and duration-bound continuous effects into
   layered atoms, order timestamps/dependencies, and derive the current rules
   view without mutating printed card definitions.

Engine switches over ability, effect, condition, cost, trigger, and filter
discriminants must be exhaustive. Adding a union member is expected to break an
incomplete interpreter at compile time.
