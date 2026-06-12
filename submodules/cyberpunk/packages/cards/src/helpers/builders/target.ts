import type {
  BoundTargetDSL,
  CardTargetDSL,
  ContextKey,
  ContextTargetDSL,
  GigTargetDSL,
  HostTargetDSL,
  SelfTargetDSL,
} from "@tcg/cyberpunk-types";

export const target = {
  self: (): SelfTargetDSL => ({ selector: "self" }),
  host: (): HostTargetDSL => ({ selector: "host" }),
  bound: (id: string, index?: number): BoundTargetDSL => ({
    selector: "bound",
    id,
    ...(index === undefined ? {} : { index }),
  }),
  context: (key: ContextKey): ContextTargetDSL => ({ selector: "context", key }),
  card: (filter: Omit<CardTargetDSL, "selector"> = {}): CardTargetDSL => ({
    selector: "card",
    ...filter,
  }),
  gig: (filter: Omit<GigTargetDSL, "selector">): GigTargetDSL => ({
    selector: "gig",
    amount: 1,
    ...filter,
  }),
};
