import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
  {
    rules: {
      // Relaxed TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn", // Changed from error to warn
      "@typescript-eslint/no-explicit-any": "warn", // Allow 'any' type with warning
      "@typescript-eslint/ban-ts-comment": "warn", // Allow @ts-ignore with warning
      "@typescript-eslint/no-non-null-assertion": "warn", // Allow ! operator with warning
      
      // Relaxed React rules
      "react-hooks/exhaustive-deps": "warn", // Changed from error to warn
      "react/no-unescaped-entities": "off", // Allow apostrophes in JSX
      "react/display-name": "off", // Don't require display names
      
      // Relaxed general rules
      "no-console": "off", // Allow console.log statements
      "no-debugger": "warn", // Allow debugger with warning
      "prefer-const": "warn", // Suggest const but don't error
      "no-var": "warn", // Suggest let/const but don't error
      
      // Relaxed import rules
      "import/no-anonymous-default-export": "off", // Allow anonymous default exports
      "import/order": "off", // Don't enforce import order
      
      // Relaxed Next.js rules
      "@next/next/no-img-element": "off", // Allow regular img tags
      "@next/next/no-html-link-for-pages": "off", // Allow regular anchor tags
      
      // Relaxed accessibility rules
      "jsx-a11y/alt-text": "warn", // Warn about missing alt text
      "jsx-a11y/anchor-is-valid": "warn", // Warn about invalid anchors
      "jsx-a11y/click-events-have-key-events": "warn", // Warn about click events
      
      // Relaxed naming conventions
      "camelcase": "warn", // Warn about non-camelCase but don't error
      "no-underscore-dangle": "off", // Allow underscores in names
      
      // Relaxed complexity rules
      "complexity": "off", // Don't limit function complexity
      "max-lines": "off", // Don't limit file length
      "max-lines-per-function": "off", // Don't limit function length
      "max-params": "off", // Don't limit function parameters
      
      // Relaxed formatting rules
      "indent": "off", // Let Prettier handle indentation
      "quotes": "off", // Let Prettier handle quotes
      "semi": "off", // Let Prettier handle semicolons
      "comma-dangle": "off", // Let Prettier handle trailing commas
      
      // Relaxed error handling
      "no-throw-literal": "warn", // Warn about throwing non-Error objects
      "prefer-promise-reject-errors": "warn", // Warn about rejecting with non-Error
      
      // Relaxed async rules
      "require-await": "warn", // Warn about unnecessary async
      "no-async-promise-executor": "warn", // Warn about async promise executors
      
      // Relaxed variable rules
      "no-unused-expressions": "warn", // Warn about unused expressions
      "no-unused-labels": "warn", // Warn about unused labels
      "no-useless-return": "warn", // Warn about unnecessary returns
      
      // Relaxed object rules
      "object-shorthand": "warn", // Warn about not using shorthand
      "prefer-object-spread": "warn", // Warn about not using spread
      
      // Relaxed array rules
      "prefer-spread": "warn", // Warn about not using spread
      "array-callback-return": "warn", // Warn about missing returns
      
      // Relaxed function rules
      "func-style": "off", // Don't enforce function style
      "no-loop-func": "warn", // Warn about functions in loops
      "prefer-arrow-callback": "warn", // Suggest arrow functions
      
      // Relaxed string rules
      "prefer-template": "warn", // Suggest template literals
      "no-useless-concat": "warn", // Warn about unnecessary concatenation
      
      // Relaxed number rules
      "no-magic-numbers": "off", // Allow magic numbers
      "prefer-numeric-literals": "warn", // Suggest numeric literals
      
      // Relaxed comparison rules
      "eqeqeq": "warn", // Warn about == instead of ===
      "no-eq-null": "off", // Allow == null checks
      
      // Relaxed logical rules
      "no-unneeded-ternary": "warn", // Warn about unnecessary ternaries
      "prefer-nullish-coalescing": "warn", // Suggest ?? operator
      
      // Relaxed destructuring rules
      "prefer-destructuring": "warn", // Suggest destructuring
      "no-useless-rename": "warn", // Warn about unnecessary renames
      
      // Relaxed regex rules
      "prefer-regex-literals": "warn", // Suggest regex literals
      "no-control-regex": "warn", // Warn about control characters
      
      // Relaxed comment rules
      "spaced-comment": "off", // Don't enforce comment spacing
      "multiline-comment-style": "off", // Don't enforce comment style
      
      // Relaxed file rules
      "eol-last": "off", // Don't require newline at end
      "no-trailing-spaces": "warn", // Warn about trailing spaces
      "no-multiple-empty-lines": "warn", // Warn about multiple empty lines
    },
  },
];

export default eslintConfig;
