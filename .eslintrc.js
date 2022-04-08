module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier", "import"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: ["builtin", "external", "index"],
        pathGroupsExcludedImportTypes: ["builtin"],
        pathGroups: [
          {
            pattern: "@serj/**",
            group: "external",
            position: "after",
          },
        ],
      },
    ],
  },
};
