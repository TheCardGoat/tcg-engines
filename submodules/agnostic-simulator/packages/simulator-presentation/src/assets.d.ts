declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}
interface ImportMeta {
  readonly env: { readonly VITE_SIMULATOR_SOUND_ASSET_BASE?: string };
}
