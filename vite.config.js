import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    // Base path for production - IMPORTANT for Railway deployment
    base: "/",
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],
            refresh: true,
            buildDirectory: "build",
        }),
        react(),
    ],
    // Build configuration
    build: {
        // Output directory relative to public/
        outDir: "public/build",
        emptyOutDir: true,
        // Ensure assets are properly hashed for cache busting
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-leaflet", "leaflet"],
                },
            },
        },
    },
    // Ensure proper asset handling
    assetsInclude: [
        "**/*.svg",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.gif",
    ],
});
