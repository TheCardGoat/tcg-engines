import type {
  Ability,
  AbilityLimit,
  AbilityTargetBinding,
  AbilityTrigger,
  CardAttacksEvent,
  CardKeyword,
  CardPlayedEvent,
  Condition,
  Cost,
  Effect,
  FightResolvedEvent,
  GigStolenEvent,
  GigValueChangedEvent,
  TargetDSL,
} from "@tcg/cyberpunk-types";

interface AbilityState {
  text: string;
  source?: TargetDSL;
  conditions: Condition[];
  costs: Cost[];
  effects: Effect[];
}

function createState(): AbilityState {
  return { text: "", conditions: [], costs: [], effects: [] };
}

function finalize(
  state: AbilityState,
  extras: {
    kind: Ability["kind"];
    keyword?: CardKeyword;
    trigger?: AbilityTrigger;
    limits?: AbilityLimit[];
    bindings?: AbilityTargetBinding[];
  },
): Ability {
  const out: Ability = {
    kind: extras.kind,
    text: state.text,
    effects: state.effects,
  };
  if (extras.keyword !== undefined) out.keyword = extras.keyword;
  if (state.source !== undefined) out.source = state.source;
  if (extras.trigger !== undefined) out.trigger = extras.trigger;
  if (extras.limits && extras.limits.length > 0) out.limits = extras.limits;
  if (extras.bindings && extras.bindings.length > 0) out.bindings = extras.bindings;
  if (state.conditions.length > 0) out.conditions = state.conditions;
  if (state.costs.length > 0) out.costs = state.costs;
  return out;
}

class BaseAbilityBuilder<Self extends BaseAbilityBuilder<Self>> {
  protected readonly state: AbilityState = createState();

  text(text: string): Self {
    this.state.text = text;
    return this as unknown as Self;
  }

  source(target: TargetDSL): Self {
    this.state.source = target;
    return this as unknown as Self;
  }

  condition(c: Condition): Self {
    this.state.conditions.push(c);
    return this as unknown as Self;
  }

  effect(e: Effect): Self {
    this.state.effects.push(e);
    return this as unknown as Self;
  }

  cost(c: Cost): Self {
    this.state.costs.push(c);
    return this as unknown as Self;
  }
}

export class KeywordAbilityBuilder extends BaseAbilityBuilder<KeywordAbilityBuilder> {
  private kw?: CardKeyword;

  keyword(k: CardKeyword): this {
    this.kw = k;
    return this;
  }

  build(): Ability {
    if (this.kw === undefined) {
      throw new Error("KeywordAbilityBuilder.build(): .keyword(...) is required");
    }
    return finalize(this.state, { kind: "keyword", keyword: this.kw });
  }
}

export class StaticAbilityBuilder extends BaseAbilityBuilder<StaticAbilityBuilder> {
  build(): Ability {
    return finalize(this.state, { kind: "static" });
  }
}

export class TriggeredAbilityBuilder extends BaseAbilityBuilder<TriggeredAbilityBuilder> {
  private trig?: AbilityTrigger;
  private readonly limits: AbilityLimit[] = [];
  private readonly bindings: AbilityTargetBinding[] = [];

  onPlay(): this {
    this.trig = { trigger: "play" };
    return this;
  }
  onAttack(): this {
    this.trig = { trigger: "attack" };
    return this;
  }
  onFlip(): this {
    this.trig = { trigger: "flip" };
    return this;
  }
  onCall(): this {
    this.trig = { trigger: "call" };
    return this;
  }
  onActivated(): this {
    this.trig = { trigger: "activated" };
    return this;
  }
  onDefeated(): this {
    this.trig = { trigger: "defeated" };
    return this;
  }

  onCardPlayed(args: Omit<CardPlayedEvent, "event">): this {
    this.trig = { trigger: "event", event: { event: "cardPlayed", ...args } };
    return this;
  }
  onCardAttacks(args: Omit<CardAttacksEvent, "event">): this {
    this.trig = { trigger: "event", event: { event: "cardAttacks", ...args } };
    return this;
  }
  onGigStolen(args: Omit<GigStolenEvent, "event">): this {
    this.trig = { trigger: "event", event: { event: "gigStolen", ...args } };
    return this;
  }
  onGigValueChanged(args: Omit<GigValueChangedEvent, "event">): this {
    this.trig = { trigger: "event", event: { event: "gigValueChanged", ...args } };
    return this;
  }
  onFightResolved(args: Omit<FightResolvedEvent, "event">): this {
    this.trig = { trigger: "event", event: { event: "fightResolved", ...args } };
    return this;
  }

  limit(l: AbilityLimit): this {
    this.limits.push(l);
    return this;
  }

  bind(id: string, target: TargetDSL): this {
    this.bindings.push({ id, target });
    return this;
  }

  build(): Ability {
    if (this.trig === undefined) {
      throw new Error("TriggeredAbilityBuilder.build(): a trigger is required (e.g. .onPlay())");
    }
    return finalize(this.state, {
      kind: "triggered",
      trigger: this.trig,
      limits: this.limits,
      bindings: this.bindings,
    });
  }
}

export const AbilityBuilder = {
  keyword(): KeywordAbilityBuilder {
    return new KeywordAbilityBuilder();
  },
  static(): StaticAbilityBuilder {
    return new StaticAbilityBuilder();
  },
  triggered(): TriggeredAbilityBuilder {
    return new TriggeredAbilityBuilder();
  },
};
