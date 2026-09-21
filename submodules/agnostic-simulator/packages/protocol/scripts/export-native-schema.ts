import { z } from "zod";
import { writeFile } from "node:fs/promises";
import { NativeClientMessage, NativeServerMessage } from "../src/native.ts";
for (const [name, schema] of [
  ["client", NativeClientMessage],
  ["server", NativeServerMessage],
] as const) {
  await writeFile(
    new URL(`../fixtures/native/${name}.schema.json`, import.meta.url),
    JSON.stringify(z.toJSONSchema(schema, { io: "input", reused: "ref" }), null, 2) + "\n",
  );
}
