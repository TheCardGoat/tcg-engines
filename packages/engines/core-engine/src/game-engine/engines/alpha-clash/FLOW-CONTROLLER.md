# Alpha Clash Flow Controller

This document describes the implementation of the FlowController for Alpha Clash, which manages the game's turn structure, phases, steps, and state transitions according to the game rules.

## Overview

The FlowController is responsible for:

1. Managing the turn structure (phases and steps)
2. Enforcing the rules of turn progression
3. Handling priority between players
4. Managing action windows and allowed actions
5. Processing state transitions
6. Supporting the Combat/Clash flow
7. Handling state-based actions

## Turn Structure

Alpha Clash uses the following turn structure, implemented in the FlowController:

1. **Start of Turn Phase**
   - Resolve start of turn effects

2. **Expansion Phase**
   - Ready Step: Ready all cards (skipped on first turn)
   - Draw Step: Draw one card (skipped on first turn)
   - Resource Step: May place one card face down in Resource Zone

3. **Primary Phase**
   - Available Actions:
     - Play Clash cards
     - Play Clashground cards
     - Play Accessories
     - Play Basic Actions
     - Set Traps
     - Activate abilities
     - Attach Weapons
     - Initiate Clash (triggers Clash Phase)
     - End turn

4. **Clash Phase** (embedded within the Primary Phase)
   - Attack Step: Active player declares attackers
   - Counter Step: Defending player may play Counter-Attack cards/effects
   - Obstruct Step: Defending player declares blockers
   - Attacker's Clash Buff Step: Attacking player may play one Clash Buff
   - Defender's Clash Buff Step: Defending player may play one Clash Buff
   - Damage Step: Simultaneous damage calculation and effects

5. **End of Turn Phase**
   - Resolve end of turn triggers
   - Expire "until end of turn" effects
   - Remove non-clash damage from Clash cards

## Priority System

Alpha Clash uses an "APNAP" (Active Player, Non-Active Player) priority system for resolving effects and responding to actions. The FlowController implements this system by:

1. Tracking which player currently has priority
2. Passing priority in APNAP order when players pass
3. Opening specific priority windows for Counter-Play, Counter-Attack, and Counter-Trap effects
4. Resolving the stack when all players pass priority

## State Transitions

The FlowController manages state transitions between phases and steps. Key transitions include:

1. Normal progression through turn phases (Start → Expansion → Primary → End)
2. Transitions within Expansion phase steps (Ready → Draw → Resource)
3. Transitions during Clash (Attack → Counter → Obstruct → Attacker Buff → Defender Buff → Damage)
4. Transitions triggered by specific actions (e.g., initiating clash, ending turn)
5. End of turn transitions and cleanup

## Effect Resolution

Alpha Clash uses a stack-based effect resolution system. When effects are played in response to other effects, they form a stack that resolves in Last In, First Out (LIFO) order:

1. Player plays an effect/card
2. Effect goes onto the stack
3. Players have priority to respond
4. When all players pass, the last effect added to the stack resolves first

## Combat/Clash Flow

The FlowController implements the detailed step-by-step flow of combat as described in the Alpha Clash rules:

1. **Attack Step**: Attacker declares attackers and targets
2. **Counter Step**: Defender has priority to play Counter-Attack effects
3. **Obstruct Step**: Defender declares blockers
4. **Attacker's Clash Buff Step**: Attacker may play one Clash Buff
5. **Defender's Clash Buff Step**: Defender may play one Clash Buff
6. **Damage Step**: Damage is calculated and applied

Special combat mechanics are handled:
- Superspeed (cards with Superspeed deal damage first)
- Breakthrough (excess damage is dealt to the Contender)

## State-Based Actions

The FlowController checks for state-based actions at appropriate times:

1. Clash card with damage ≥ defense is defeated
2. Player with Contender health ≤ 0 loses the game
3. Player drawing from empty deck loses the game
4. Expired effects are removed

## Usage

```typescript
import { createAlphaClashFlowController } from './flow-controller';

// Create a new flow controller instance
const flowController = createAlphaClashFlowController();

// Process an action
flowController.processAction({
  type: ActionType.START_GAME
});

// Get the current state
const state = flowController.getState();

// Check if an action is allowed
const isAllowed = flowController.isActionAllowed(AlphaClashActionType.PLAY_CLASH_CARD, "0");
```

## Integration with Game Engine

The FlowController is designed to integrate with the broader game engine by:

1. Managing the turn structure and flow
2. Providing hooks for game-specific logic
3. Enforcing allowed actions at various points in the game
4. Tracking and enforcing priority
5. Handling transitions between phases and steps
6. Supporting the core stack-based effect resolution system

For detailed implementation, see `flow-controller.ts` and tests in `flow-controller.test.ts`.