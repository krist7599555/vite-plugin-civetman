import type { ResolvedConfig, ViteDevServer, Plugin } from "vite";
import {
  fork,
  type SpawnOptions,
  type ChildProcess,
} from "node:child_process";


function spawn_civetman_cli(command: "dev" | "build", opt: SpawnOptions = {}) {
  const program = fork("./node_modules/civetman/dist/index.js", [command], {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
    env: { ...process.env, PATH: process.env.PATH, SHELL: process.env.SHELL, FORCE_COLOR: "1" },
    cwd: process.cwd(),
    ...opt,
  });
  return program;
}

export function civetman() {
  let config: ResolvedConfig;
  let process_watch: ChildProcess | undefined = undefined;
  return {
    name: "vite-plugin-civetman" as const,
    configResolved(resolvedConfig: ResolvedConfig) {
      console.log('vite plugin')
      config = resolvedConfig;
    },
    async buildStart() {
      if (config.command == "build") {
        const process = spawn_civetman_cli("build");
        await new Promise<void>((resolve) => {
          process.on("close", () => resolve());
          process.on("exit", () => resolve());
        });
      }
    },
    async configureServer(_server: ViteDevServer) {
      if (config.command == "serve") {
        process_watch = spawn_civetman_cli("dev");
      }
    },
  } satisfies Plugin;
}
