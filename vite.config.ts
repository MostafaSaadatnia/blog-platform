import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['src/test/setup.ts'],
        include: ['src/**/*.spec.ts'],
        coverage: {
            reporter: ['text', 'lcov'],
            all: true,
            include: ['src/app/**/*.{ts}'],
            exclude: ['**/*.spec.ts', '**/main.ts', '**/environment*.ts', '**/polyfills.ts',
                '**/*.d.ts']
        }
    }
});