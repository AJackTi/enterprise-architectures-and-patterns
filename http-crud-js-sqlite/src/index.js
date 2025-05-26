import { AutoRouter } from "itty-router";
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

router.get("/items", () => getAllItems());
router.get("/items/:id", ({ params }) => getItemById(params.id));
router.post("/items", async (req, { baseUrl }) =>
  createItem(baseUrl, await req.arrayBuffer()),
);
router.put("/items/:id", async (req, { baseUrl }) =>
  updateItemById(baseUrl, req.params.id, await req.arrayBuffer()),
);
router.delete("/items", async (req) =>
  deleteManyItems(await req.arrayBuffer()),
);
router.delete("/items/:id", ({ params }) => deleteItemById(params.id));
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
