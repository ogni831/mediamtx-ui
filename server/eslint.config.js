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
            "no-unused-vars": "warn",
            "no-empty": "warn",
            "no-undef": "off",
            "no-constant-condition": ["warn", {checkLoops: false}],
        },
    },
];
