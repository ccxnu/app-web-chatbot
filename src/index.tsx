import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
  },

  development: import.meta.env.PROD && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
