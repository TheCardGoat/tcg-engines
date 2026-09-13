# FAB engine core — the move → next-state pipeline

How a legal player command becomes the published next match state. This is the
contract for the production dispatch path; structure tests at the bottom enforce
it. Card behavior, evaluation, and automation policy live above this pipeline
and are not described here.

## Pipeline

```
decodeFabCommand                     moves.ts — fail-closed payload decode
        │
        ▼
FabMatchRuntime.applyCommand         runtime.ts — admit command, open candidate
        │  clone mutable state once (match program stays shared)
        ▼
routeFabCommand                      commands/command-router.ts — exhaustive 10-move table
        │
        ▼
command handler                      commands/handlers/* — thin adapters
        │  check holder → start a procedure; never advance combat/stack themselves
        ▼
procedure                            procedures/* — CR processes; pause on decisions
        │  play-card, activate-ability, advance (pass cycles), combat, turn, layer-resolution
        ▼
executeFabEventTransaction           kernel/transaction/index.ts
        │  replacements → reduce → triggers → continuous reconcile
        ▼
commitFabKernelBatch → reduceFabGameEvent   kernel/commit.ts, rules/reducers/
        │
        ▼
drain automation → serialize snapshot → publish logs → swap runtime.state
```

## Owners

| Concern                                | Owner                                               | Notes                                                                                                                                                                                                                                           |
| -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Match ownership, publish-or-rollback   | `runtime.ts`                                        | `applyCommand` / `dispatch` / publication only                                                                                                                                                                                                  |
| Engine-owned transaction ports         | `runtime-transaction-options.ts`                    | builds `FabEventTransactionOptions` from the named ports (`FabTriggerPort`, `FabAmountPort`, `FabRandomPort`, `FabTargetingPort`, `FabProcedurePort`, `FabKernelEventSink` — `kernel/process-runner/types.ts`, `kernel/trigger-declaration.ts`) |
| Legal move names for a seat            | `runtime-moves.ts`                                  | `enumerateFabMoves` — deliberately coarse move-type availability; payload instantiation lives per move in `rules/legal-commands/`                                                                                                               |
| Automation drain inside a command      | `runtime-automation.ts`                             | fixed-point drain of priority/trigger/decision automation                                                                                                                                                                                       |
| Command decode + handler table         | `commands/`                                         | one thin handler per `FabMoveName`; handlers start procedures, they do not run them                                                                                                                                                             |
| Pass-cycle advance (CR 1.11 / 4.3 / 7) | `procedures/advance/`                               | stack resolution, combat step advance, end-turn hand-off                                                                                                                                                                                        |
| CR procedures                          | `procedures/`                                       | may pause on a decision; propose events, never reduce them                                                                                                                                                                                      |
| Event transactions                     | `kernel/`                                           | atomic batches, replacements, process stages; production code may not pick a reducer (`commitFabKernelBatch`)                                                                                                                                   |
| State writes                           | `rules/reducers/`                                   | the only writers of rules-visible state                                                                                                                                                                                                         |
| Card effects → events                  | `rules/proposals/`                                  | AST → proposed events                                                                                                                                                                                                                           |
| "Is this legal?"                       | `rules/legality*`, quotes                           | fail-closed CR source of truth                                                                                                                                                                                                                  |
| "What is this object now?"             | `rules-view`, `state-rules-view`, `rules-evaluator` | read-only derived properties                                                                                                                                                                                                                    |

## Invariants

- The **command candidate is the only mutable document**. Helpers mutate it in
  place (`mutateInPlace` short-circuits on the command-owned candidate); a
  failed command is rolled back by discarding the candidate.
- A handler never advances combat or the stack; it starts a procedure.
- A procedure never reduces events itself; it proposes them to the kernel.
- A reducer never opens a player decision.
- Only reducers write rules-visible state. Only `commitFabKernelBatch` commits.
- One clone per command; the match program (`cardDefinitions`,
  `publicCardIdentities`) is structurally shared.
- Snapshot serialization on every successful command is an invariant, not a
  rendering step; it refuses illegal transitions.

## The rules-process stage machine

A persisted `FabRulesProcess` (rules/process.ts) is the CR 1.9 event
transaction in flight. Its `stage` is written **only** through
`transitionFabRulesProcessStage` (kernel/process-state.ts), whose adjacency
table (`FAB_PROCESS_STAGE_EDGES`) is the executable definition of legal
hand-offs; a modular-dispatch structure test forbids direct `.stage` writes
anywhere else.

The machine is **interleaved, not linear**. A `layer-resolution` process
passes through `event-commit` and `trigger-collection` while a triggered
layer declares and resolves, then returns to `layer-resolution`; journals
collect their triggers during the work-group commit itself and move straight
from `event-commit` to the boundary stages. Consequences for state shape:

- Only the replacement-prompt bookkeeping (candidates, choice tracking,
  orders) is stage-local; it is reset at the single post-commit site in
  `transaction/work-group.ts` (`persistCommittedTransactionWork`).
- The trigger queue and effect-resolution context legitimately span stages,
  so a strict per-stage field union on `FabRulesProcess` would mismodel the
  machine. Illegal _transitions_ are unrepresentable via the door; illegal
  _field mixes_ are prevented by the single reset discipline.
- The nested procedure types (`FabPlayCardProcedure`, `FabEndTurnProcedure`,
  …) are already discriminated by `kind` and own their own sub-stages.

## Kernel transaction modules

`kernel/transaction/` — `index.ts` holds the facade
(`executeFabEventTransaction` / `executeFabEventJournalTransaction`);
`work-group.ts` is the canonical replacement→commit runner;
`replacement-prompts.ts` the four suspension prompts; `trigger-persistence.ts`
trigger collection and prize enqueues; `persisted-replacement-commit.ts` the
cost/re-clash receipts; `administrative.ts` the admin commit path.
`kernel/process-runner/` owns boundary advance, replacement resume, and the transaction option/result types — the transaction facade lives only in `kernel/transaction/index.ts`.

## Enforcement (structure tests)

- `runtime-decomposition.structure.test.ts` — runtime/handler decomposition,
  pass handler may not import combat/layer-resolution/end-turn internals,
  no import cycles containing runtime or command modules.
- `state-domain-decomposition.structure.test.ts`, `rules/modular-dispatch.structure.test.ts`,
  `export-lockdown.structure.test.ts` — domain and export boundaries.
- `transaction-safety.test.ts`, `runtime-contract.test.ts` — the rollback and
  receipt contracts.
