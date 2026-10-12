import config from "./vite.config.ts";
export default { ...config, ssr: { noExternal: [/^@tcg\//] } };
