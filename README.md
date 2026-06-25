# The Axiom Room

**The Axiom Room** is a minimalist symbolic logic puzzle about inference, proof chains, and quiet mathematical intuition.

Players combine symbolic blocks such as `P -> Q`, `~Q`, `P & Q`, and `P v Q` to derive valid conclusions inside a restrained, study-like interface.

![The Axiom Room screenshot](./screencapture.png)

## Live

Play it here:

[https://axiom-room.musnotes.my.id/](https://axiom-room.musnotes.my.id/)

Symbol reference:

[Axiom Room Symbol Glossary](https://www.musnotes.my.id/en/projects/axiom-room-symbol-glossary/)

## What This Build Includes

This repository currently contains a single-page browser game built with plain:

* `index.html`
* `style.css`
* ES modules under `src/`

Current features:

* 18 handcrafted levels
* symbolic block selection and derived statements
* hints for each level
* decoy paths where a valid move is not always the winning move
* a proof log that records new derivations
* an inspector panel with `Proof Log`, `Stats`, and `Levels` tabs
* current-run stats for successful new derivations, invalid attempts, and hints used
* persistent per-level best records stored in `localStorage`
* level selector badges for completed and clean-solved levels
* local progress saving for the last opened level and highest completed level
* subtle Web Audio feedback for selection, success, invalid moves, and completion
* a small `Sound: On / Off` toggle
* a built-in `Symbol Glossary` help link near the `Hint` control
* footer links to MuS and Ko-fi support

## Logic Covered

The current puzzle set introduces and reuses patterns such as:

* Modus Ponens
* Modus Tollens
* Hypothetical Syllogism
* Conjunction Introduction
* Simplification
* Disjunctive Syllogism
* Double Negation
* Contraposition
* decoy-valid proof paths
* longer multi-step inference chains

## How to Play

Each level presents a target conclusion and a set of symbolic premises.

Select blocks that form a valid inference rule. If the move is correct, the game derives a new block or resolves the target. If the move is invalid, the selection is rejected.

Repeated valid inferences that would produce an already-derived output are acknowledged without adding another proof log entry or increasing the successful step count.

The help flow is intentionally minimal:

* `Hint` helps with the current level
* `Symbol Glossary` acts as a permanent reference for notation

Complete the target proof to reveal `Q.E.D.`.

The `Stats` tab shows the current run and the best completed record for the current level. Best records prefer fewer hints, then fewer invalid attempts, then fewer successful derivations. The `Levels` tab marks completed levels and clean solves.

## Run Locally

No framework and no build step are required.

You can run the project by:

* serving the folder with a small local server and opening the local URL
* using any static host that can serve `index.html`, `style.css`, and `src/`

Because the game uses ES modules, a local server is recommended over directly opening `index.html`.

## Educational Scope

The Axiom Room is an experimental learning piece, not a full formal logic course.

This build still focuses only on symbolic inference puzzles.

Its purpose is to make symbolic reasoning feel tactile and approachable through short interactive proofs, selective hints, and visual calm.

## Status

Active prototype for the first Axiom Room logic wing.

Future iterations may expand the puzzle language, proof structure, and adjacent mathematical themes without claiming those additions are present here yet.

## Author

Created by **MuS**.

Main site:

[https://www.musnotes.my.id/](https://www.musnotes.my.id/)

Support:

[https://ko-fi.com/musnotes](https://ko-fi.com/musnotes)

## License

Released under the [MIT License](./LICENSE).
