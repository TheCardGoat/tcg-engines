# Raster border lighting candidates

Generated from the existing table texture for visual review.

- table-lights-off.png: neutral lamp housings.
- table-player-lit.png: lower cyan lamps on; upper lamps off.
- table-opponent-lit.png: upper amber lamps on; lower lamps off.

All are 1536 x 1024 PNG candidates. The generated variants contain small
texture differences outside the lamps. Do not crossfade whole textures in
production: use the off image as a fixed base and restrict the lit variants
to registered lamp masks. This keeps the playfield stable and allows lighting
to change without altering the hand layer, scene lights, or card shadows.

These assets are not yet connected to the live simulator.
