// Minimal flat ESLint config (ESLint 9). Starter setup — intentionally lenient
// (noisy rules are warnings) so it can be tightened incrementally.
export default [
    {
        ignores: ["build/**", "node_modules/**", "public/help/**"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
        },
        rules: {
            // unused function arguments and caught errors are idiomatic
            // (event handlers, middleware signatures); flag only unused vars/imports.
            "no-unused-vars": ["warn", {args: "none", caughtErrors: "none", varsIgnorePattern: "^_"}],
            "no-empty": "warn",
            "no-undef": "off",
            "no-constant-condition": ["warn", {checkLoops: false}],
        },
    },
];
