declare module "deep-diff" {
  export interface Diff<T1, T2> {
    kind: "N" | "E" | "D" | "A";
    path: (string | number)[];
    lhs?: any;
    rhs?: any;
    index?: number;
    item?: Diff<T1, T2>;
  }

  export default function diff<T1, T2>(
    lhs: T1,
    rhs: T2,
    prefilter?: (path: string[], key: string) => boolean,
  ): Diff<T1, T2>[] | undefined;

  export function revertChange<T1, T2>(
    target: T1,
    source: T2,
    change: Diff<T1, T2>,
  ): void;
}
