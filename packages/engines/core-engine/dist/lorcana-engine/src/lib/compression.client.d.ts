export declare function compress(input: any): Promise<{
    base64String: string;
    compressedBuffer: ArrayBuffer;
}>;
export declare function compressAndCompareSizes(input: any): Promise<{
    inputSize: number;
    compressedSize: number;
    base64Size: number;
    base64String: string;
    compressedBuffer: ArrayBuffer;
}>;
export declare function decompress<T>(base64String: string): Promise<{
    decompressedString: string;
    compressedBuffer: ArrayBuffer | Buffer<ArrayBuffer>;
    parsedString: T;
}>;
export declare function decompressAndCompareSizes(base64String: any): Promise<any>;
//# sourceMappingURL=compression.client.d.ts.map