# Phylosquizz

Explore philosophical worldviews through an interactive, question-based matching system.

[Live app](https://phylosquizz.pages.dev)

## How it works

The current static HTML application represents answers and thinkers in eight dimensions. The scoring pipeline aggregates answer weights with `calculateRawVector`, normalizes values to a bounded 1–10 scale, computes weighted cosine similarity with `cosineSimilarity`, and ranks curated thinker vectors with `getFinalResult`.

The result highlights philosophical perspectives closest to and furthest from your answers. The curated vectors are interpretive educational models.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 and use `index.html`, the current self-contained web application. The earlier React implementation and test page remain in the repository for historical reference.

## Roadmap

- Extract the scoring functions into a testable module.
- Document the scoring methodology and thinker data provenance.
- Add deterministic tests for ranking and edge cases.

## License

MIT. See [LICENSE](LICENSE). Third-party attribution is retained within the bundled source.
