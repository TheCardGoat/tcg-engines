// Helper function to compress using Deflate
async function compressToDeflateBuffer(input: any) {
  const stream = new CompressionStream("deflate");
  const writer = stream.writable.getWriter();
  writer.write(new TextEncoder().encode(input));
  writer.close();

  // Return compressed binary data (ArrayBuffer)
  return await new Response(stream.readable).arrayBuffer();
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: any) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    // @ts-ignore
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary); // Convert binary data to Base64 string
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: any) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

// Helper function to decompress using Inflate
async function decompressFromDeflateBuffer(buffer: any) {
  const stream = new DecompressionStream("deflate");
  const writer = stream.writable.getWriter();
  writer.write(buffer);
  writer.close();

  // Return decompressed binary data (ArrayBuffer)
  const decompressedBuffer = await new Response(stream.readable).arrayBuffer();
  return new TextDecoder().decode(decompressedBuffer);
}

export async function compress(input: any) {
  const inputString = typeof input !== "string" ? JSON.stringify(input) : input;

  // 1. Compress input string using Deflate
  const compressedBuffer = await compressToDeflateBuffer(inputString);

  // 2. Convert compressed binary (ArrayBuffer) to Base64 string
  const base64String = arrayBufferToBase64(compressedBuffer);

  return { base64String, compressedBuffer };
}

export async function compressAndCompareSizes(input: any) {
  const now = performance.now();

  const { base64String, compressedBuffer } = await compress(input);

  // 3. Calculate sizes
  const inputSize = new TextEncoder().encode(
    typeof input !== "string" ? JSON.stringify(input) : input,
  ).length; // Original input size (in bytes)
  const compressedSize = compressedBuffer.byteLength; // Compressed binary size (in bytes)
  const base64Size = new TextEncoder().encode(base64String).length; // Base64-encoded size (in bytes)

  // 4. Log size comparisons
  console.log(`TEST Original Input Size: ${inputSize} bytes`);
  console.log(`TEST Compressed (Binary) Size: ${compressedSize} bytes`);
  console.log(`TEST Base64 (Compressed) Size: ${base64Size} bytes`);
  console.log(`TEST Compression Ratio: ${base64Size / inputSize}`);
  console.log(`TEST Compression Binary Ratio: ${compressedSize / inputSize}`);
  console.log(`TEST Compression Time: ${performance.now() - now} ms`);

  return {
    inputSize,
    compressedSize,
    base64Size,
    base64String,
    compressedBuffer,
  }; // Return for further usage if needed
}

export async function decompress<T>(base64String: string) {
  console.log("Decompressing", base64String);
  const compressedBuffer =
    typeof window === "undefined"
      ? Buffer.from(base64ToArrayBuffer(base64String))
      : base64ToArrayBuffer(base64String);
  // console.log("compressedBuffer", window === undefined, compressedBuffer);

  const decompressedString =
    await decompressFromDeflateBuffer(compressedBuffer);
  // console.log("Decompressed", decompressedString);
  let parsedString: T | undefined;

  try {
    parsedString = JSON.parse(decompressedString) as T;
    console.log("Parsed", parsedString);
  } catch (e) {
    console.error("Error parsing decompressed string", e);
  }

  return { decompressedString, compressedBuffer, parsedString };
}

export async function decompressAndCompareSizes(base64String: any) {
  const now = performance.now();

  const { decompressedString, compressedBuffer } =
    await decompress(base64String);

  // 3. Calculate sizes
  const decompressedSize = new TextEncoder().encode(decompressedString).length; // Decompressed size (in bytes)

  // 4. Log size comparisons
  console.log(
    `TEST Decompressed (Binary) Size: ${compressedBuffer.byteLength} bytes`,
  );
  console.log(`TEST Decompressed Output Size: ${decompressedSize} bytes`);

  try {
    return JSON.parse(decompressedString);
  } catch (e) {
    console.error("Error parsing decompressed string", e);
    return decompressedString;
  } finally {
    console.log(`TEST Decompression Time: ${performance.now() - now} ms`);
  }
}
