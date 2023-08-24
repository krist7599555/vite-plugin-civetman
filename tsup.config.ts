import { defineConfig } from 'tsup'

export default defineConfig({
	target: "esnext",
	format: "esm",
	outDir: "./dist",
	entry: ["./index.ts"],
	clean: true,
	dts: true
})