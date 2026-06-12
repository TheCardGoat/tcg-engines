/**
 * Gundam TCG — Flow Definition
 *
 * Boundaries (mirrors Lorcana pattern):
 *   Moves     → player decisions only (choose first player, mulligan choice)
 *   onEnter   → automatic game actions triggered by entering a phase/step
 *   endIf     → condition that causes the flow to auto-advance
 *
 * All lifecycle hooks live under ./lifecycle/ organized by phase; this file
 * wires them into the flow shape.
 *
 * Turn structure:
 *
 * [setup]
 *   choose-first-player  Player nominates who goes first
 *     endIf: turnPlayer != null → auto-advance to mulligan
 *   mulligan             Both players decide whether to redraw
 *     onEnter: shuffle decks, draw 5 cards for each player (rules 6-2-1-2/5)
 *     endIf: pendingDecision.length === 0 → auto-advance
 *     onExit: fill shield areas (6-2-2), place EX Base tokens (6-2-3),
 *             place EX Resource token for Player Two (6-2-4)
 *
 * [turnCycle] Repeating turns — the flow runner cycles via advanceTurn():
 *   start-phase      Ready cards + start-of-turn effects
 *     active-step    7-2-3-1: ready all rested cards
 *     start-step     7-2-4-1: "at start of turn" effects
 *     endIf: () => true → auto-advance to draw-phase
 *   draw-phase        7-3-1: draw one card; deck-out = loss (7-3-1-1)
 *     endIf: () => true → auto-advance to resource-phase
 *   resource-phase    7-4-1: place one resource card
 *     endIf: () => true → auto-advance to main-phase
 *   main-phase        Play cards, activate abilities, assign pilots, attack
 *     endIf: nextTurnPlayer is set → advance to end-phase
 *   end-phase         7-6-1: four ordered steps
 *     action-step    7-6-3 / 9: standby→active player take turns; ends when both pass
 *     end-step       7-6-4: "at end of turn" effects
 *     hand-step      7-6-5: discard to hand limit (10)
 *     cleanup-step   7-6-6: clear "this-turn" effects
 *
 * Flags:
 *   nextTurnPlayer — set by passTurn, drives main-phase→end-phase and turn cycling
 *   pendingDecision — used by mulligan and action-step for multi-player decisions
 * turn.onEnd:   Repair, clear turn metadata, clear this-turn continuous effects
 */

import type { FlowDefinition } from "../types/index.ts";
import {
  turnCycleOnBegin,
  turnCycleOnEnd,
  mulliganOnEnter,
  mulliganOnExit,
  startPhaseActiveStep,
  drawPhaseOnEnter,
  resourcePhaseOnEnter,
  mainPhaseEndIf,
  attackStepOnEnter,
  blockStepOnEnter,
  battlePhaseBlockStepEndIf,
  battleActionStepOnEnter,
  battlePhaseActionStepEndIf,
  battlePhaseDamageStepOnEnter,
  battleEndStepOnEnter,
  actionStepOnEnter,
  actionStepEndIf,
  endStepOnEnter,
  handStepEndIf,
  cleanupStepOnEnter,
} from "./lifecycle/index.ts";
import { drainPendingEffects } from "./effects/pending-effects.ts";

export const gundamFlow: FlowDefinition = {
  initialGameSegment: "setup",
  // Auto-drain the pending-effect queue before any flow transition.
  // See effects/pending-effects.ts.
  onTransitionCheck: drainPendingEffects,
  gameSegments: {
    // ------------------------------------------------------------------
    // Setup Segment
    // ------------------------------------------------------------------
    setup: {
      id: "setup",
      name: "Setup",
      order: 0,
      next: "turnCycle",
      turn: {
        initialPhase: "choose-first-player",
        phases: {
          "choose-first-player": {
            id: "choose-first-player",
            name: "Choose First Player",
            order: 0,
            validMoves: ["chooseFirstPlayer", "resolveEffect", "dropOpponent", "skipOpponentTurn"],
            endIf: (state) => state.ctx.status.turnPlayer != null,
            nextPhase: "mulligan",
          },

          mulligan: {
            id: "mulligan",
            name: "Mulligan",
            order: 1,
            onEnter: mulliganOnEnter,
            validMoves: ["alterHand", "resolveEffect", "dropOpponent", "skipOpponentTurn"],
            endIf: (state) => (state.ctx.status.pendingDecision?.length ?? 0) === 0,
            onExit: mulliganOnExit,
          },
        },
      },
    },

    // ------------------------------------------------------------------
    // Turn Cycle Segment
    // ------------------------------------------------------------------
    turnCycle: {
      id: "turnCycle",
      name: "Turn Cycle",
      order: 1,
      turn: {
        initialPhase: "start-phase",
        onBegin: turnCycleOnBegin,
        onEnd: turnCycleOnEnd,
        endIf: (state) => state.ctx.status.nextTurnPlayer != null,
        phases: {
          "start-phase": {
            id: "start-phase",
            name: "Start Phase",
            order: 0,
            nextPhase: "draw-phase",
            endIf: () => true,
            steps: {
              "active-step": {
                id: "active-step",
                name: "Active Step",
                order: 0,
                onEnter: startPhaseActiveStep,
                endIf: () => true,
              },
              "start-step": {
                id: "start-step",
                name: "Start Step",
                order: 1,
                endIf: () => true,
              },
            },
          },
          "draw-phase": {
            id: "draw-phase",
            name: "Draw Phase",
            order: 1,
            onEnter: drawPhaseOnEnter,
            nextPhase: "resource-phase",
            endIf: () => true,
          },
          "resource-phase": {
            id: "resource-phase",
            name: "Resource Phase",
            order: 2,
            onEnter: resourcePhaseOnEnter,
            nextPhase: "main-phase",
            endIf: () => true,
          },
          "main-phase": {
            id: "main-phase",
            name: "Main Phase",
            order: 3,
            endIf: mainPhaseEndIf,
            nextPhase: "end-phase",
            validMoves: [
              "deployUnit",
              "deployBase",
              "playCommand",
              "activateAbility",
              "assignPilot",
              "playCommandAsPilot",
              "enterBattle",
              "resolveEffect",
              "passTurn",
              "dropOpponent",
              "skipOpponentTurn",
            ],
          },
          "battle-phase": {
            id: "battle-phase",
            name: "Battle Phase",
            order: 3,
            steps: {
              "attack-step": {
                id: "attack-step",
                name: "Attack Step",
                order: 0,
                onEnter: attackStepOnEnter,
                endIf: () => true,
              },
              "block-step": {
                id: "block-step",
                name: "Block Step",
                order: 1,
                onEnter: blockStepOnEnter,
                endIf: battlePhaseBlockStepEndIf,
                validMoves: [
                  "declareBlock",
                  "passBlock",
                  "resolveEffect",
                  "dropOpponent",
                  "skipOpponentTurn",
                ],
              },
              "action-step": {
                id: "action-step",
                name: "Action Step",
                order: 2,
                onEnter: battleActionStepOnEnter,
                endIf: battlePhaseActionStepEndIf,
                validMoves: [
                  "playCommand",
                  "activateAbility",
                  "passBattleAction",
                  "resolveEffect",
                  "dropOpponent",
                  "skipOpponentTurn",
                ],
              },
              "damage-step": {
                id: "damage-step",
                name: "Damage Step",
                order: 3,
                onEnter: battlePhaseDamageStepOnEnter,
                endIf: () => true,
              },
              "battle-end-step": {
                id: "battle-end-step",
                name: "Battle End Step",
                order: 4,
                onEnter: battleEndStepOnEnter,
                endIf: () => true,
              },
            },
          },
          "end-phase": {
            id: "end-phase",
            name: "End Phase",
            order: 4,
            endIf: (state) => state.ctx.status.step === undefined,
            steps: {
              "action-step": {
                id: "action-step",
                name: "Action Step",
                order: 0,
                onEnter: actionStepOnEnter,
                endIf: actionStepEndIf,
                validMoves: [
                  "playCommand",
                  "activateAbility",
                  "passActionStep",
                  "resolveEffect",
                  "dropOpponent",
                  "skipOpponentTurn",
                ],
              },
              "end-step": {
                id: "end-step",
                name: "End Step",
                order: 1,
                onEnter: endStepOnEnter,
                endIf: () => true,
              },
              "hand-step": {
                id: "hand-step",
                name: "Hand Step",
                order: 2,
                endIf: handStepEndIf,
                validMoves: [
                  "discardToHandLimit",
                  "resolveEffect",
                  "dropOpponent",
                  "skipOpponentTurn",
                ],
              },
              "cleanup-step": {
                id: "cleanup-step",
                name: "Cleanup Step",
                order: 3,
                onEnter: cleanupStepOnEnter,
                endIf: () => true,
              },
            },
          },
        },
      },
    },
  },
};
