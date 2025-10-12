# Section 10: Rules Management - Light Summary

This document provides a streamlined overview of rules management—the automatic game state checks and adjustments that occur during gameplay.

## What is Rules Management?

Rules management consists of automatic processes that the game performs to maintain proper game state. These processes happen automatically whenever specific conditions are met, regardless of what else is happening in the game.

## Core Principle

**Immediate Resolution**: Rules management occurs the moment a triggering event happens, even if other actions are being performed. This takes priority over most game actions.

## Five Types of Rules Management

### 1. Determination of Defeat Management

**When it occurs**: At the start of any rules management check

**What it checks**:
- Does any player have an empty shield area and just received battle damage from a Unit?
- Does any player have zero cards remaining in their deck?

**Result**: Any player meeting a defeat condition is immediately defeated

#### Defeat Conditions
1. **Shield Area Defeat**: Player receives battle damage from a Unit while having no cards in their shield area (no Base, no Shields)
2. **Deck-Out Defeat**: Player has no cards remaining in their deck

**Simultaneous Defeats**: If both players meet defeat conditions at the same time, both players are defeated simultaneously.

### 2. Destruction Management

**When it occurs**: Whenever a Unit, Base, or Shield has zero or less HP

**What it checks**:
- Has any Unit's HP become zero or less?
- Has any Base's HP become zero or less?
- Has any Shield taken damage equal to its HP (1)?

**Result**: The card is destroyed and placed in the trash

#### Key Details
- Shields always have exactly 1 HP
- Destruction is immediate when HP reaches zero
- Destroyed cards go directly to trash
- Paired Pilots move with destroyed Units

### 3. Battle Area Excess Management

**When it occurs**: When a Unit is being deployed and the battle area already has 6 Units

**Limit**: Maximum 6 Units in the battle area

**Resolution Process**:
1. Player deploying the new Unit chooses one Unit already in their battle area
2. Chosen Unit is placed in the trash
3. New Unit is deployed

#### Important Notes
- Units removed this way are **not** considered destroyed
- Effects that trigger "when destroyed" do not activate
- When multiple Units deploy simultaneously, remove an equal number of existing Units

### 4. Managing Shield Area Base Section Excess

**When it occurs**: When a Base is being deployed and a Base already exists in the base section

**Limit**: Maximum 1 Base in the base section of the shield area

**Resolution Process**:
1. Player deploying the new Base chooses one Base already in their base section
2. Chosen Base is placed in the trash
3. New Base is deployed

#### Important Notes
- Bases removed this way are **not** considered destroyed
- Effects that trigger "when destroyed" do not activate
- This only applies to the base section, not the shield section

### 5. (Not explicitly detailed in this section)
Note: The full comprehensive rules list five types of rules management. Sections 10-1 through 10-5 cover the fundamentals and four specific management types.

## Rules Management Priority

Rules management happens in a specific order when checking game state:

1. **First**: Check for defeat conditions
2. **Then**: Check for destruction (zero HP)
3. **Then**: Check for battle area excess (if deploying)
4. **Then**: Check for base section excess (if deploying)

## Key Concepts

### Automatic Execution
- Rules management is not optional
- Players cannot choose when it occurs
- Happens automatically when conditions are met
- Cannot be prevented by card effects (unless explicitly stated)

### Not Considered Destruction
Some rules management removes cards from play without destroying them:
- Units removed due to battle area excess
- Bases removed due to base section excess

These removals:
- Do not trigger "when destroyed" effects
- Do not count as destruction for any game purposes
- Simply move the card to trash as a game rule

### Simultaneous Events
When multiple cards reach zero HP simultaneously:
- All are destroyed at the same time
- All destruction effects trigger simultaneously
- Active player resolves their triggered effects first
- Standby player resolves their triggered effects second

## Timing Examples

### Example 1: Battle Damage Destruction
1. Unit deals damage to another Unit
2. Defending Unit's HP becomes zero
3. **Immediately**: Destruction management occurs
4. Unit is placed in trash
5. Any "when destroyed" effects trigger

### Example 2: Deploying with Full Battle Area
1. Player has 6 Units in battle area
2. Player plays a new Unit card from hand
3. **Before new Unit enters**: Battle area excess management occurs
4. Player chooses and removes one existing Unit to trash
5. New Unit is deployed

### Example 3: Simultaneous Defeat
1. Both players have no shields or bases
2. Battle occurs between two Units
3. Battle damage would defeat both players
4. **Determination of defeat management occurs**
5. Both players are defeated simultaneously
6. Game ends in a draw

## Strategic Implications

### Battle Area Management
- Be strategic about which Unit to remove when deploying at max capacity
- Consider removing damaged or less useful Units
- Plan ahead to avoid difficult choices

### Base Replacement
- Deploying a new Base means sacrificing your current Base
- Consider timing: deploy when current Base is damaged
- Some effects may care about Bases being placed in trash

### HP Tracking
- Track damage carefully to know when destruction will occur
- Effects that prevent destruction are powerful
- Effects that reduce HP to zero trigger destruction immediately

For complete details, see [full rules](./full.md).
