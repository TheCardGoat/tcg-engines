/**
 * Declaration file for object-hash module
 */

declare module "object-hash" {
  interface ObjectHashOptions {
    algorithm?: string;
    encoding?: string;
    excludeValues?: boolean;
    ignoreUnknown?: boolean;
    replacer?: (value: unknown) => unknown;
    respectFunctionProperties?: boolean;
    respectFunctionNames?: boolean;
    respectType?: boolean;
    unorderedArrays?: boolean;
    unorderedObjects?: boolean;
    unorderedSets?: boolean;
  }

  interface ObjectHash {
    (obj: unknown, options?: ObjectHashOptions): string;
    MD5(data: unknown): string;
    keys(obj: object): string;
    keysMD5(obj: object): string;
    sha1(obj: unknown): string;
  }

  const objectHash: ObjectHash;
  export default objectHash;
}
