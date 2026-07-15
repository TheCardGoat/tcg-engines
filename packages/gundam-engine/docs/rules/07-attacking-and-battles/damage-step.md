# 7-6. Damage Step

## 7-6-1. Confirming the Target

At the beginning of the Damage Step, the game confirms the current target of the attack. The target may have changed from the original declaration if <Blocker> was activated during the Block Step.

## 7-6-2. Attack on a Player

When the target of the attack is a player, the following sequence occurs:

### 7-6-2-1. Calculating Damage

The attacking Unit's Attack value becomes the amount of damage dealt to the defending player.

### 7-6-2-2. Applying Damage

The defending player takes damage equal to the attacking Unit's Attack value. This damage is resolved according to the damage rules in Section 9.

### 7-6-2-3. Damage Modification Effects

Any effects that modify damage dealt or damage taken are applied at this time, according to the rules in Section 8.

### 7-6-2-4. Card Draw from Damage

For each point of damage taken, the defending player draws one card from their deck. This card draw is mandatory and occurs immediately as part of damage resolution.

### 7-6-2-5. Deck Depletion Check

If the defending player must draw cards but has no cards remaining in their deck, they lose the game immediately according to the loss condition rules in Section 10.

## 7-6-3. Attack on a Unit

When the target of the attack is a Unit, the following sequence occurs:

### 7-6-3-1. Comparing Attack Values

Compare the Attack value of the attacking Unit with the Attack value of the target Unit.

### 7-6-3-2. Mutual Destruction

Both the attacking Unit and the target Unit deal damage to each other equal to their respective Attack values. If a Unit's Attack value is equal to or greater than the other Unit's Defense value, that Unit is destroyed.

### 7-6-3-3. Simultaneous Destruction

If both Units would be destroyed as a result of combat, both Units are destroyed simultaneously. Neither Unit is considered to have been destroyed before the other.
