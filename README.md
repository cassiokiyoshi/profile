# Cassio Kiyoshi — Profile

Personal portfolio featuring selected software projects, a short biography, and interactive browser experiments. Built with HTML and CSS.

[View the profile](https://cassiokiyoshi.github.io/profile/)

## Run locally

From this repository's root, with Python 3 installed:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The profile requires no package installation or build step.

## Projects

| Project | Description | Documentation | Repository |
| --- | --- | --- | --- |
| Falling Sand | C simulation compiled to WebAssembly, with sand, water, and walls | [README](playground/falling-sand/README.md) | [falling-sand](https://github.com/cassiokiyoshi/falling-sand) |
| Sound Pixels | Microphone-reactive pixel visualizer using TypeScript and Web Audio | [README](playground/sound-pixels/README.md) | [sound-pixels](https://github.com/cassiokiyoshi/sound-pixels) |
| Pathfinder | A*, Dijkstra, and BFS visualizer with a Go API and Svelte frontend | [README](playground/pathfinder/README.md) | [pathfinder](https://github.com/cassiokiyoshi/pathfinder) |

The playground source is also included here. Falling Sand and Sound Pixels can be served as static files; Pathfinder needs its API and frontend development server running separately.

## Structure and publishing

- `index.html`: profile content and project links.
- `assets/`: styles, images, and favicon.
- `playground/`: experiment source and setup instructions.

The profile is maintained on the `gh-pages` branch for GitHub Pages. Its experiment links point to the standalone projects. Changes to playground copies in this repository do not automatically update the standalone repositories.
