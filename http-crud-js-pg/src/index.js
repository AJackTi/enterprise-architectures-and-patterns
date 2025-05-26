// For AutoRouter documentation refer to https://itty.dev/itty-router/routers/autorouter
import { AutoRouter } from "itty-router";
import { withConfig } from "./config";
import {
  deleteItemById,
  deleteManyItems,
  getAllItems,
  getItemById,
  createItem,
  updateItemById,
  notFound,
} from "./handlers";

let router = AutoRouter();
router.all("*", withConfig);
router.get("/items", ({ config }) => getAllItems(config));
router.get("/items/:id", ({ params, config }) =>
  getItemById(config, params.id),
);
router.post("/items", async (req, { baseUrl }) =>
  createItem(req.config, baseUrl, await req.arrayBuffer()),
);
router.put("/items/:id", async (req, { baseUrl }) =>
  updateItemById(req.config, baseUrl, req.params.id, await req.arrayBuffer()),
);
router.delete("/items", async (req) =>
  deleteManyItems(req.config, await req.arrayBuffer()),
);
router.delete("/items/:id", (req) => deleteItemById(req.config, req.params.id));
router.all("*", () => notFound("Endpoint not found"));

addEventListener("fetch", (event) => {
  const fullUrl = event.request.headers.get("spin-full-url");
  const path = event.request.headers.get("spin-path-info");
  const baseUrl = fullUrl.substr(0, fullUrl.indexOf(path));

  event.respondWith(
    router.fetch(event.request, {
      baseUrl,
      fullUrl,
      path,
    }),
  );
});
