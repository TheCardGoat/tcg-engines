import type { Diff } from "deep-diff";
export type DeltaCompressType<T> = Diff<T, T>[] | undefined;
export declare function calculateDiff<T>(oldDoc: T, newDoc: T): any;
export declare function deltaCompress<T>(oldDoc: T, newDoc: T): DeltaCompressType<T>;
export declare function revertDiff<T>(doc: T, diff?: Diff<T, T>[]): T;
export declare function revertCompressedDiff<T>(base64String: string, doc?: T): Promise<T>;
//# sourceMappingURL=deltaCompression.d.ts.map