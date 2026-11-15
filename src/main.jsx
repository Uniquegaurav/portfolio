import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { content, loadContent } from "./data/content";

// Load content first (remote JSON if configured), THEN import the app,
// so every component reads the final content. Nothing imported above touches content-derived modules.
(async () => {
  const source = await loadContent();
  if (import.meta.env.DEV) console.info(`[content] using ${source} content`);
  if (content.seo?.title) document.title = content.seo.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && content.seo?.description) meta.setAttribute("content", content.seo.description);

  const { default: App } = await import("./App.jsx");
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
