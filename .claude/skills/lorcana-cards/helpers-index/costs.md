# Cost Helpers

Cost helpers define **costs that must be paid** for activated abilities or other game actions. They create `Cost` objects.

## Source Files
- `packages/lorcana-engine/src/abilities/abilities.ts`

---

## Character Costs

### `exertCharCost(amount)`
**When to use:** "Exert X characters" as a cost

```typescript
exertCharCost(1)  // Exert 1 character
exertCharCost(2)  // Exert 2 characters
```

**Returns:** Cost object with `exertCard` type

---

### `discardCharCost(amount)`
**When to use:** "Discard X characters" as a cost

```typescript
discardCharCost(1)  // Discard 1 character
discardCharCost(2)  // Discard 2 characters
```

**Returns:** Cost object with `discardCard` type

---

## Item Costs

### `exertItemCost(amount)`
**When to use:** "Exert X items" as a cost

```typescript
exertItemCost(1)  // Exert 1 item
exertItemCost(2)  // Exert 2 items
```

**Returns:** Cost object with `exertCard` type

---

### `banishItemCost(amount)`
**When to use:** "Banish X items" as a cost

```typescript
banishItemCost(1)  // Banish 1 item
banishItemCost(2)  // Banish 2 items
```

**Returns:** Cost object with `banishCard` type

---

## Usage in Activated Abilities

Costs are typically used in activated abilities (abilities with an inkwell symbol or other activation requirement).

### Example: Exert to Activate
```typescript
export const abilityName: ActivatedAbility = {
  type: "activated",
  name: "Ability Name",
  text: "↷ — Draw a card.",
  costs: [exertCharCost(1)],  // Exert this character
  effects: [drawACard],
};
```

### Example: Multiple Costs
```typescript
export const abilityName: ActivatedAbility = {
  type: "activated",
  name: "Ability Name",
  text: "Exert this character and discard a card — Draw 2 cards.",
  costs: [
    exertCharCost(1),  // Exert this character
    { type: "discard", amount: 1 }  // Discard a card
  ],
  effects: [drawXCards(2)],
};
```

---

## Cost Object Structure

Costs follow this general structure:

```typescript
interface Cost {
  type: "exertCard" | "discardCard" | "banishCard" | "discard" | "ink";
  amount?: number;
  filters?: TargetFilter[];
  target?: CardEffectTarget;
}
```

---

## Common Cost Types

### Exert This Character
```typescript
costs: [{ 
  type: "exertCard",
  amount: 1,
  filters: [{ filter: "source", value: "self" }]
}]
```

**Shorthand:** `exertCharCost(1)` when used with `thisCharacter` as source

---

### Discard from Hand
```typescript
costs: [{
  type: "discard",
  amount: 1
}]
```

---

### Banish Item
```typescript
costs: [{
  type: "banishCard",
  amount: 1,
  filters: [
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" }
  ]
}]
```

**Shorthand:** `banishItemCost(1)`

---

### Ink Cost (Alternative Costs)
```typescript
costs: [{
  type: "ink",
  amount: 2  // Pay 2 ink
}]
```

---

## Usage Tips

1. **Activated Abilities:**
   - Costs are paid BEFORE effects resolve
   - Player must be able to pay all costs
   - Costs are mandatory (not "may")

2. **Cost Order:**
   - Multiple costs are paid in the order listed
   - Usually exert costs come first
   - Discard/Banish costs come after

3. **Common Patterns:**
   ```typescript
   // Pattern 1: Exert ability
   costs: [exertCharCost(1)]
   
   // Pattern 2: Exert + discard
   costs: [
     exertCharCost(1),
     { type: "discard", amount: 1 }
   ]
   
   // Pattern 3: Banish item
   costs: [banishItemCost(1)]
   ```

4. **Triggered Ability Costs:**
   - Triggered abilities can also have costs
   - Costs are paid when the trigger resolves
   - If costs can't be paid, ability doesn't resolve

5. **Card Text Patterns:**
   - `"↷"` = Exert this character
   - `"↷, Discard a card"` = Exert + discard
   - `"Banish this item"` = Banish cost
   - `"Pay X ⬡"` = Ink cost

---

## Example Activated Abilities

### Simple Exert Ability
```typescript
export const readyAnother: ActivatedAbility = {
  type: "activated",
  name: "Ready Another",
  text: "↷ — Ready another chosen character of yours.",
  costs: [exertCharCost(1)],
  effects: [readyAnotherChosenCharacter],
};
```

### Exert + Discard
```typescript
export const drawTwo: ActivatedAbility = {
  type: "activated",
  name: "Draw Two",
  text: "↷, Discard a card — Draw 2 cards.",
  costs: [
    exertCharCost(1),
    { type: "discard", amount: 1 }
  ],
  effects: [drawXCards(2)],
};
```

### Banish Item
```typescript
export const dealDamage: ActivatedAbility = {
  type: "activated",
  name: "Deal Damage",
  text: "Banish this item — Deal 3 damage to chosen character.",
  costs: [banishItemCost(1)],
  effects: [dealDamageToChosenCharacter(3)],
};
```

---

## Related Concepts

### Cost Resolution
The game checks if costs can be paid in this order:
1. **Identify costs:** Read all costs from the ability
2. **Choose targets:** If costs require targeting (e.g., "Exert a character"), choose now
3. **Verify legality:** Can all costs be paid?
4. **Pay costs:** Execute all cost actions
5. **Resolve effects:** Execute the ability's effects

### Cost vs Effect
- **Cost:** Paid BEFORE the ability resolves (mandatory)
- **Effect:** Happens AFTER costs are paid (result of the ability)

Example: `"↷, Discard a card — Draw 2 cards"`
- **Costs:** Exert this character, discard a card
- **Effects:** Draw 2 cards

---

## Advanced Cost Patterns

### Multiple Character Exerts
```typescript
costs: [{
  type: "exertCard",
  amount: 2,  // Exert 2 characters
  filters: [
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" }
  ]
}]
```

### Specific Characteristic Cost
```typescript
costs: [{
  type: "exertCard",
  amount: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["hero"] },
    { filter: "owner", value: "self" }
  ]
}]
```

### Discard Specific Card Type
```typescript
costs: [{
  type: "discardCard",
  amount: 1,
  filters: [
    { filter: "type", value: "action" },
    { filter: "zone", value: "hand" }
  ]
}]
```

---

## Related Files
- [triggers.md](triggers.md) - Triggers can have costs
- [effects.md](effects.md) - Effects that happen after costs
- [targets.md](targets.md) - Targets for costs
- [conditions.md](conditions.md) - Conditions checked before costs

