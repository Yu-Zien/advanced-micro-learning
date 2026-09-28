# KaTeX provenance

- Package: `katex`
- Version: `0.18.9`
- Registry artifact: `katex-0.18.9.tgz`
- Retrieved: 2026-09-28 with `npm pack katex@0.18.9`
- Package SHA-256: `78174318fa53363e4321ac3c10b39d3598aaa73a92dc75362eb08b16f6705782`
- License: MIT; see `LICENSE` in this directory.

Vendored runtime files:

- `katex.mjs` — SHA-256 `180dade94d7cbd593e59ded86d347f1482e1e17840ee528109283b1b888452af`
- `katex.min.css` — SHA-256 `b9ce0e8ce93f0c18c4986fe1f1c3c269d921b56a69e6c97f83a507916b38aab5`
- `contrib/auto-render.mjs` — SHA-256 `e0410e8ce6c38869bf2f703fcc3b8d192308b5f3b34264625d605d742b1309e0`
- `fonts/*.woff2` — official fonts from the same package artifact.

The site imports these local files directly; formula rendering does not depend on a CDN or an external runtime API.
