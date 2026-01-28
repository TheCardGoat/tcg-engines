# Section 6: Chains & Showdowns

**Rule References:** 527-563
**Full Document:** `references/21_40_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers how spells and abilities resolve through the Chain, Showdown windows, and the process of playing cards.

---

## 528-531: Relevant Players

### Definition (529)
Relevant Players can act during:
- Chains
- Showdowns

### Who is Relevant (531)

| Situation | Relevant Players |
|-----------|------------------|
| Combat occurring | Players involved in Combat |
| No Combat | All Players |
| Invited | Players who accept invitation |

### Invitation (531.2)
- Active Player can invite non-Relevant player
- Invited player may refuse (stays non-Relevant)
- If accepted: Must play a card or activate ability, becomes Relevant for duration

### Relevance Duration (530)
Once Relevant, stays Relevant until the Window of Opportunity ends.

---

## 532-544: The Chain

### What is the Chain (533)
- Non-Board Zone that temporarily exists when cards are played or abilities activated
- Cards placed here as part of being played
- Abilities queued here as part of resolving

### Chain Properties (534-535)
- Only one Chain can exist at a time
- New cards/abilities added to existing Chain
- Chain existing = **Closed State**
- No Chain = **Open State**

### Steps of Resolving a Chain (536-544)

#### 1. Chain Created (537)
- Player who created chain becomes first **Active Player**
- Active Player is distinct from Turn Player

#### 2. Permanents Skip Priority (538)
- If initiating card was a permanent, no priority before resolution
- Skip to step 7

#### 3. Define Relevant Players (539)

#### 4. Active Player Options (540)
- **Play a legally timed Spell** (Reaction in Closed State)
- **Activate legally timed Abilities**
- **Invite a player to act**
- **Pass** - Priority goes to next Relevant Player in Turn Order

#### 5. All Pass Check (540.4.b)
- If all Relevant Players pass in sequence, Chain ends
- Proceed to resolution

#### 6. Triggered Abilities (541)
- Added as most recent item on Chain
- Don't affect Active Player order
- Controller becomes Relevant if not already

#### 7. Resolve the Chain (543)
- Identify last item added
- Execute its effect
- Place in appropriate zone:
  - Spells → Owner's trash
  - Permanents → Board at chosen location
  - Abilities → Cease to exist
- Perform Cleanup
- Return to step 3 (controller of next item becomes Active Player)

#### 8. Repeat (544)
- Continue until Chain is empty

---

## 545-553: Showdowns

### What is a Showdown (546)
- Window of Opportunity for Relevant Players
- Open State where players can play Spells alternately
- Each spell creates a Chain as normal

### Showdown State (547)
- **Showdown State** = Showdown in progress
- Default: Cards and abilities cannot be played
- Exception: Action or Reaction keywords

### When Showdowns Begin (548)
- Battlefield control is Contested AND turn is Neutral Open
- **With Combat:** Two players contesting = Showdown as Combat step
- **Without Combat:** Uncontrolled Battlefield becomes Contested = Showdown during Cleanup

### Showdown Setup (549-551)
- Player who applied Contested status gains **Focus**
- Initial Relevant Players:
  - Combat: Attacking and Defending players
  - Non-Combat: All players

### Initial Chain (551)
- Combat Showdowns may have Initial Chain of:
  - "When I attack" triggers
  - "When I defend" triggers
- Player with Focus orders their triggers first, then Turn Order

### Focus Passing (552)
- When last Chain item resolves, Focus passes to next Relevant Player

### Player with Focus Options (553)
- **Play legally timed spell** (starts Chain)
- **Activate legally timed abilities**
- **Invite a player** (they gain Focus)
- **Pass** - If all pass in sequence, Showdown ends

---

## 554-563: Playing Cards

### The Process of Play (557-563)

#### Step 1: Put on Chain (558)
- Remove card from current zone
- Place onto Chain
- State becomes **Closed**

#### Step 2: Make Choices (559)
- Spell choices or "As I am played" choices
- Unit location choice
- Target choices (specific Game Objects)
- **Targeting rules:**
  - Invalid/Unavailable targets = instruction doesn't execute
  - Partial targets = execute on available targets
  - Mistargeting = target no longer valid

#### Step 3: Determine Total Cost (560)
- Apply "ignore cost" effects (set to zero)
- Apply additional costs (mandatory and optional)
- Apply cost increases
- Apply discounts
- Costs can't go below 0

#### Step 4: Pay Costs (561)
- Pay Energy and Power costs
- Can activate Add Reactions during this step
- Pay non-standard costs

#### Step 5: Check Legality (562)
- Verify all targets are legal
- Ensure no illegal state would be created
- If illegal, undo and cancel

#### Step 6: Complete Play (563)
- **Permanents:** Leave Chain, become Game Object, enter Board
- **Spells:** Linger on Chain, opponents can React, then resolve and go to trash

### Handling Illegal Instructions (563.2.c)
- Spell resolves even if some targets are illegal
- Illegal targets are unaffected
- Instructions that can't be followed are ignored
- Partial instructions are followed as much as possible

---

## Targeting Summary

### What Counts as Targeting (559.3)
- Choosing specific Game Objects
- NOT: Effects based on criteria ("all gear")
- NOT: Triggered ability choices (made when trigger resolves)

### Splitting Damage (559.3.d)
- Each target is chosen when spell is played
- Division decided at resolution
- Each target must receive at least 1 damage
- If more targets than damage at resolution, controller removes excess targets

---

## Common Questions

**Q: Can I respond to my opponent playing a card?**
A: Only with Reaction cards/abilities (Closed State)

**Q: What happens if a spell's target becomes invalid?**
A: That target is unaffected, but spell still resolves (563.2.c.5)

**Q: When do I choose targets for triggered abilities?**
A: When the ability resolves, not when it triggers (559.3.b)

**Q: Can I play cards during a Showdown?**
A: Only with Action or Reaction keywords

**Q: What's the difference between Active Player and Turn Player?**
A: Turn Player is whose turn it is; Active Player is who has priority on the Chain

**Q: Do permanents use the Chain?**
A: Yes, but no one gets priority before they resolve (538)

---

## Related Sections

- **Section 5: Turn Structure** - When Chains and Showdowns occur
- **Section 7: Abilities** - Ability types and resolution
- **Section 9: Combat** - Combat Showdowns

---

*For detailed rules, read the full section in the Core Rules document*
