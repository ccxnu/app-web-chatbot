import { STORAGE_KEYS } from "@/api/http/types";

export default class UID {
  private async hash(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async generateHeaderID(): Promise<string> {
    const nav = navigator as any;
    const res: any[] = [];
    try {
      res.push(nav.userAgent);
      res.push(nav.platform);
      res.push(nav.product);
      res.push(nav.productSub);
      res.push(nav.vendor);
      res.push(nav.vendorSub);
      res.push(nav.plugins?.length ?? 0);
      // basic plugin names if available
      if (nav.plugins) {
        const names: string[] = [];
        for (let i = 0; i < nav.plugins.length; i++) {
          names.push(nav.plugins[i]?.name ?? "");
        }
        res.push(names.join("|"));
      } else {
        res.push("");
      }
      res.push(nav.mimeTypes?.length ?? 0);
      if (nav.mimeTypes) {
        const m: string[] = [];
        for (let i = 0; i < nav.mimeTypes.length; i++) {
          m.push(nav.mimeTypes[i]?.type ?? "");
        }
        res.push(m.join("|"));
      } else {
        res.push("");
      }
      res.push(nav.languages ?? []);
      res.push(nav.hardwareConcurrency ?? 0);
      res.push(Object.keys(nav).length);
    } catch {
      // ignore
    }
    return this.hash(JSON.stringify(res));
  }

  async generateCanvasID(): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      canvas.height = 100;
      canvas.width = 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "30px Arial";
        ctx.fillText("Hello World", 20, 90);
      }
      const dataUrl = canvas.toDataURL();
      return this.hash(dataUrl);
    } catch {
      return this.hash("canvas-fallback");
    }
  }

  async generateWebGlID(): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") ||
        canvas.getContext("webgl")) as WebGLRenderingContext | null;
      const res: any[] = [];
      if (gl) {
        try {
          const renderer = gl.getParameter((gl as any).RENDERER);
          const vendor = gl.getParameter((gl as any).VENDOR);
          res.push(renderer);
          res.push(vendor);
          const dbg = gl.getExtension("WEBGL_debug_renderer_info");
          if (dbg) {
            res.push(gl.getParameter((dbg as any).UNMASKED_RENDERER_WEBGL));
            res.push(gl.getParameter((dbg as any).UNMASKED_VENDOR_WEBGL));
          }
        } catch {
          // ignore
        }
      }
      return this.hash(JSON.stringify(res));
    } catch {
      return this.hash("webgl-fallback");
    }
  }

  async getIPAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      localStorage.setItem(STORAGE_KEYS.DEVICE_ADDRESS, data.ip);
      return data.ip || '0.0.0.0';
    } catch {
      return '0.0.0.0';
    }
  }

  async completeID(): Promise<string> {
    const [h, c, w, i] = await Promise.all([
      this.generateHeaderID(),
      this.generateCanvasID(),
      this.generateWebGlID(),
      this.getIPAddress(),
    ]);
    return this.hash(h + c + w + i);
  }

}