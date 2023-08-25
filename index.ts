import type { ResolvedConfig, ViteDevServer, Plugin } from "vite";
import {
  fork,
  type SpawnOptions,
  type ChildProcess,
} from "node:child_process";


/**!
 * Helper to run civetman in another process
 * @param {"dev" | "build"} command
 * @param {SpawnOptions} opt 
 * @returns {ChildProcess} 
 */
function runCivetmanCli(command: "dev" | "build", opt: SpawnOptions = {}): ChildProcess {
  const program = fork("./node_modules/civetman/dist/index.js", [command], {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
    env: { PATH: process.env.PATH, FORCE_COLOR: "1" },
    cwd: process.cwd(),
    ...opt,
  });
  globalThis.process.on("exit", () => {
    program.kill("SIGTERM")
  })
  return program;
}


/**
 * Vite Plugin Civetman (compile .civet to .ts)
 * @returns {Plugin}
 */
export function civetman(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "vite-plugin-civetman" as const,
    configResolved(resolvedConfig: ResolvedConfig) {
      console.log('vite plugin')
      config = resolvedConfig;
    },
    async buildStart() {
      if (config.command == "build") {
        const process = runCivetmanCli("build");
        await new Promise<void>((resolve, reject) => {
          process.on("exit", (code ) => {
            if (code == 0) {
              resolve()
            } else {
              reject(new Error(`Civet Compile Error`))
            }
          });
        });
      }
    },
    async configureServer(server: ViteDevServer) {
      if (config.command == "serve") {
        let process: ChildProcess | undefined = undefined;
        function tryCompileCivetmanWatch() {
          if (process) return;
          process = runCivetmanCli("dev");
          process.on("exit", code => {
            console.error("CIVETMAN compile error is exit code=", code)
            process = undefined
          })
        }
        tryCompileCivetmanWatch();
        server.watcher.add('**/*.civet');
        server.watcher.on("change", path => {
          if (path.endsWith(".civet")) {
            tryCompileCivetmanWatch();
          }
        })
      }
    },
  }
}
