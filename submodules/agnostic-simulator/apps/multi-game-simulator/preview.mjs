// Vite's generic preview server cannot serve React Router's generated SSR
// manifest. Exercise the same Express entrypoint used in production instead.
process.env.NODE_ENV = "production";
process.env.PORT ||= "4173";

await import("./server.js");
