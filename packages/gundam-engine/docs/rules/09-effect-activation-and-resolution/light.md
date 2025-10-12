# Section 9: Effect Activation and Resolution (Light Summary)

## Overview

Effects are directives originating from card text that define how cards interact with the game. Understanding the five effect types and their activation rules is essential for proper gameplay.

## The Five Effect Types

### 9-1-5. Constant Effects

**Definition**: Effects that remain constantly active.

**Key Characteristics**:
- Active the entire time in their activation location
- Some only activate while certain conditions are fulfilled
- Do not wait to be triggered - active immediately upon entering activation location
- Multiple constant effects overlap and apply simultaneously

**Priority Rule**: When multiple constant effects conflict, effects that state something "can't" happen or otherwise disallow actions take precedence.

**Conditional Targeting**: Constant effects with conditional targets apply the moment a target fulfilling those conditions appears.

### 9-1-6. Triggered Effects

**Definition**: Effects that activate automatically when specific conditional events occur.

**Examples Include**:
- [Deploy] - when card enters play
- [When Attacking] - when Unit declares attack
- [Destroyed] - when card is destroyed
- [When Paired] - when Pilot is paired
- Effects with "when (some event occurs)" in text

**Key Characteristics**:
- Only trigger when specific conditions are fulfilled
- Activate every time condition is met (unless restricted by [Once per Turn])
- If multiple simultaneous events occur, effect triggers only once
- Effect still activates even if the card leaves its location while waiting to activate

**Resolution Order**:
- If multiple effects belonging to you trigger: resolve in order you choose
- If effects belonging to both players trigger: active player resolves first (in order they choose), then standby player
- If new effects trigger during resolution: give new effects priority and resolve them first
- [Burst] effects get priority over all other triggered effects

### 9-1-7. Activated Effects

**Definition**: Effects that can be freely activated by the player.

**Types**:
- [Activate•Main] - only during your main phase
- [Activate•Action] - only during action steps

**Key Characteristics**:
- Player chooses when to activate (within timing restrictions)
- Format: conditions before colon, effect after colon
- Satisfying conditions activates the effect
- "①" symbol means pay cost equal to number to activate
- Multiple conditions require satisfying all conditions
- If no colon or conditions listed, activate by declaration

### 9-1-8. Command Effects

**Definition**: Effects that activate when Command cards are played.

**Timing Keywords**:
- [Main] - can be played during your main phase
- [Action] - can be played during action steps
- Some have both keywords

**Key Restriction**: If a command effect requires choosing a target, the Command card cannot be played if that target cannot be chosen.

### 9-1-9. Substitution Effects

**Definition**: Effects that replace one event with another event.

**Format**: "(do) B instead of A"

**Key Characteristic**: When event A would occur, event B occurs instead due to the substitution effect.

## Effect Rules

### 9-1. General Effect Rules

**Location Limitation**: Unless specified otherwise, effects only affect cards in the battle area.

**Activation Location**: If activation location not specified, Unit or Base effects only activate while in battle area.

**Mandatory vs. Optional**:
- "Perform" = mandatory (do as much as possible)
- "You may" = optional (can choose not to activate)

### 9-2. Effect Conditions

**Condition Requirements**:
- Effects won't activate unless conditions are fulfilled
- If effect requires choosing a target, won't activate if target cannot be chosen
- Effects restricted by disallowing effects won't activate

### 9-3. Effect Activation Steps

When activating an effect, follow these steps:

1. **Check Conditions**: Fulfill required conditions (if effect cannot activate, stop here)
2. **Declare Activation**: Announce you're activating the effect; reveal card if in hand
3. **Activate Effect**: Execute the declared effect
4. **Resolve Responses**: Resolve all events that occur in response to activation

**Command Card Activation**: Present the card and perform the effect listed on it.

**Target Selection Timing**: For Command cards and triggered effects that require choosing targets, choose targets when the instruction appears in the effect.

**Number Selection Rules**:
- Must choose as many targets as possible, up to specified number
- If number not specifically indicated and effect targets a card: the card generating the effect
- If effect targets a player: the player who owns the card generating the effect

**Deck Selection**: When choosing from deck, confirm top of deck first, then choose specified card.

## Key Concepts

**Effect Stacking**: Multiple constant effects can overlap. When conflicts arise, "can't" effects take precedence.

**Triggered Effect Chain**: New triggered effects during resolution get priority. This creates chains where newest effects resolve first.

**Burst Priority**: [Burst] effects always resolve before other triggered effects, providing defensive counterplay.

**Activation Windows**: Different effect types have different timing windows (main phase, action steps, etc.) that restrict when they can be activated.

**Target Validity**: Effects requiring targets will fail to activate if valid targets don't exist at activation time.

For complete details, see [full rules](./full.md)
