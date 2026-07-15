// Idle screen is a fully static, prerendered page.
// Players sent here are AFK — no server work, no client-side game state,
// no websocket, no engine bootstrap. Just CSS dreaming on its own.
export const prerender = true;
export const ssr = false;
export const csr = true;
