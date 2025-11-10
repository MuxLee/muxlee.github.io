import { defineConfig, globalIgnores } from 'eslint/config';
import eslintForJavascript from '@eslint/js';
import eslintForTypescript from 'typescript-eslint';
import eslintForStylistic from '@stylistic/eslint-plugin';

export default defineConfig(
    eslintForJavascript.configs.recommended,
    eslintForTypescript.configs.strict,
    eslintForTypescript.configs.stylistic,
    {
        plugins: {
            '@stylistic': eslintForStylistic
        },
        rules: {
            '@stylistic/comma-dangle': [
                'error',
                'never'
            ],
            '@stylistic/indent': [
                'error',
                4
            ],
            '@stylistic/object-curly-spacing': [
                'error',
                'always'
            ],
            '@stylistic/quotes': [
                'error',
                'single'
            ],
            '@typescript-eslint/class-literal-property-style': [
                'error',
                [
                    'fields'
                ]
            ],
            '@typescript-eslint/no-explicit-any': [
                'error',
                {
                    'fixToUnknown': true,
                    'ignoreRestArgs': true
                }
            ]
        }
    },
    [
        globalIgnores([
            '.angular/*',
            '.idea/*',
            'node_modules/*'
        ])
    ]
);
