<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Frontend-only app: all student state lives in React context (`src/state/`) persisted to localStorage, read only after hydration. Why: no backend or login is in scope.
- All tutor behaviour goes through `src/services/tutorService.ts` (mocked today). Why: a real LLM must be pluggable without touching UI.
- Scoring, levels, next-concept selection and coin formula are pure functions in `src/lib/studentModel.ts`, with tests next to them. Why: easy to read, test and demo.
- Concept graph data lives in `src/data/concepts.ts`; mock questions, shop, room slots and friends live in separate `src/data/*` files. Why: content is editable without touching logic.
- Video lesson scripts and check questions live in `src/data/videos.ts`; generated videos go in `public/videos/<id>.mp4` + `<id>.vtt` (one cue per line, same order). `docs/videos/ROTEIROS.md` is the hand-off for whoever generates the videos — keep it in sync when a line changes. Why: subtitles are matched to script lines by order.
- The product name comes only from `APP_NAME` in `src/config/app.ts`. Why: the name is a placeholder.
