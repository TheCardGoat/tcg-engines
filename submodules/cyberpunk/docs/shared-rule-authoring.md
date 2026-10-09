# Shared rule ownership

Use this guide when changing cards, selectors, conditions, effect counts,
costs, event filters, or the card parser.

## Share rule decisions

Repeated code needs a shared owner when each copy is intended to answer the
same rules question. Keep independent card-specific sequences local even if
their current code happens to look alike.

Classify apparent duplication before extracting it. For example, automation's
board-fit score estimates the value of a legal action from a filtered view;
it is not a condition validator. Its estimates must never authorize an action
or become the source of legal targets. Likewise, counting Legends in the
Legends area for payment answers a different question from counting Legends
in play for an effect. Share the rule meaning, not merely a similar loop.

| Question | Owner |
| --- | --- |
| What types does this card currently have? | Engine effective-card-property queries in `state/lookups.ts` |
| What does a recurring selector such as Legends in play mean? | Named selector constructors in `@tcg/cyberpunk-types` |
| Which objects satisfy a selector? | Engine target evaluator and its shared predicates |
| How many selected objects exist? | Numeric evaluation over the selector result |
| Does a condition hold? | Engine condition evaluator using those same queries |
| What was true when a card was defeated? | Required pre-defeat snapshot and event matcher; never reconstruct from the new zone |
| Which revealed cards may a scry choice select? | Shared target evaluator; project eligible IDs to UI and automation |
| What does one card do, and in what order? | That card's authored definition |
| How is printed text represented? | Parser emitting the same typed DSL |

Do not count Legends by independently iterating the Legends area. A Legend on
the field is both a Unit and a Legend (CR 4.2.1). Explicit text restricting an
effect to the Legends area still uses that area. A selector accepting both
types returns each card only once.

## Preserve timing

Before sharing an evaluator, identify which state its rule reads:

- Current state when a condition resolves (CR 10.3.3).
- State when a trigger condition occurs (CR 10.16.1).
- Last valid information for an invalid game piece (CR 10.10.1).
- Continuously updated state for a persistent effect (CR 10.4.3).

Share predicates over the appropriate facts. Do not replace event-time facts
with current card state merely to reuse a live selector. Do not capture a
continuous count once, or recalculate a value that the effect captures once.

Legal selection and successful resolution are also different questions. CR
6.4.4–6.4.5 permits a selected Gig's instructed adjustment to fail. A shared
Gig-pair selector must enforce the printed ownership and distinct-object
constraints without requiring the value change to succeed. Resolve the failed
adjustment and continue independent instructions as the rules require.

## Change checklist

1. Read printed text and the applicable rules. Identify all consumers of the
   shared rule before editing its implementation.
2. Check cards, parser emitters, cost evaluation, conditions, prompts, command
   validation, and event filters where applicable. Remove superseded decision
   paths as their callers migrate.
3. Make a new typed variant require an explicit evaluator implementation. Do
   not silently turn an unsupported variant into zero, false, or an empty
   effect.
4. Add a regression that asserts the printed result through the engine. For a
   shared rule, also verify the relevant consumers agree on the same state.
   Expected values must not be computed by the production helper under test.
5. Test the transition that exposed the defect, not only the final fixture.
   Include timing and negative cases where they change the result.
6. Verify parser behavior for the same printing. Different printings can have
   different text. Do not preserve a known incorrect emitter with an allowlist.
7. Run focused checks, then `vp run ci:check` in the Cyberpunk workspace. Record
   actual test scope and unresolved failures.

## Consumer boundaries

UI and automation consume projected legal IDs. They must not reconstruct a
partial selector from display fields. Display labels explain a selection; they
do not authorize it. Keep private bound targets and resolution context in the
engine. A viewer projection is not an executable command snapshot.

Defeat filters use only facts supported by their captured snapshot. Reject
unsupported historical selectors in the authored type and at runtime. Adding
a historical predicate requires capturing the facts it needs at the event
boundary.

Parser consumers must inspect `unparsedSegments`. Executable generation must
reject partial results before replacing output files. Do not emit empty
abilities to conceal unsupported text.

The current audit and remaining decisions are tracked in
[`audits/shared-rule-audit.md`](audits/shared-rule-audit.md). That audit must not
be described as complete until its evidence checklist is satisfied.
