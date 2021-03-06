module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "comma-dangle": "off",
    "indent": ["error", 3],
    "react/jsx-indent": "off",
    "arrow-parens": "off",
    "no-console": "off",
    "linebreak-style": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "react/jsx-indent-props": "off"
  },
};
