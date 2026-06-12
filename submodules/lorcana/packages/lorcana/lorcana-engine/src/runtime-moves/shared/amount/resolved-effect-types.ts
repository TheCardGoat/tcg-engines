/**
 * Compile-time utility to constrain handlers to numeric amount-like fields.
 * Dynamic amount objects must be resolved before these handlers are invoked.
 */
export type WithResolvedNumericField<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: number;
};

export type WithResolvedNumericFields<T, K extends keyof T> = WithResolvedNumericFieldsTuple<
  T,
  readonly K[]
>;

export type WithResolvedNumericFieldsTuple<T, K extends ReadonlyArray<keyof T>> = Omit<
  T,
  K[number]
> & {
  [P in K[number]]?: number;
};
