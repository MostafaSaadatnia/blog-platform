import 'reflect-metadata';
(globalThis as any).matchMedia ||= () => ({ matches: false });
