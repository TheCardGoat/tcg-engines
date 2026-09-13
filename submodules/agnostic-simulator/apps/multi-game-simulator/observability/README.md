# Multi-game simulator - SigNoz observability

The browser app exports errors, warnings, document-load spans, fetch/XHR spans,
click/submit spans, and Web Vitals to the same-origin `/otel` proxy. Production
uses `service.name=tcg-multi-game-simulator` and a 10% trace sample ratio. Log
records are not sampled.

Telemetry includes normalized route, game slug, release SHA, deployment
environment, and a random per-tab `session.id`. It does not include account
identity, cookies, URL query strings, deck contents, replay payloads, or game
state.

Live-match telemetry includes browser-to-gateway ping RTT
(`websocket.gateway_round_trip`) and the full heartbeat RTT across the gateway,
Redis inbox, game server, and return delivery (`websocket.game_round_trip`).
Neither signal exports Socket.IO connection IDs or account identity.

Import `dashboard.json` through **Dashboards -> New dashboard -> Import JSON**.
Import each entry in `alerts.json` through **Alerts -> New alert -> JSON** or
the SigNoz rules API.
