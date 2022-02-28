module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    quotes: [2, "double", { avoidEscape: true }],
    "import/prefer-default-export": 0,
    "react/function-component-definition": 0,
    "react/jsx-filename-extension": 0,
    "comma-dangle": 0,
    "react/jsx-props-no-spreading": 1,
    "react/react-in-jsx-scope": 0,
    "import/no-unresolved": 0,
    "import/named": 0,
    "linebreak-style": 0,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0
  },
};
