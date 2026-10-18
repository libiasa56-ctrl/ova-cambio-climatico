import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ova-cambio-climatico.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'Clima, Poder y Futuro | OVA 11°',
      description: 'Objeto Virtual de Aprendizaje de Ciencias Sociales 11° - I.E. Ciudad de Ipiales & UTB',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Español',
          lang: 'es',
        },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Bienvenida e Inicio',
          items: [
            { label: 'Portada y Presentación', slug: 'index' },
          ],
        },
        {
          label: '01. Fundamentos Curriculares',
          items: [
            { label: 'Contexto Escolar & DBA 11.°', slug: 'fundamentos/contexto-dba' },
            { label: 'Rúbricas Analíticas de Desempeño', slug: 'fundamentos/rubrica-formativa' },
          ],
        },
        {
          label: '02. Estrategias Didácticas (Módulos)',
          items: [
            { label: 'Estrategia 1: ¿Quién está detrás? (Earth + Padlet)', slug: 'estrategias/estrategia-1-quien-esta-detras' },
            { label: 'Estrategia 2: Detectives del Clima (Fact-Checking)', slug: 'estrategias/estrategia-2-detectives-clima' },
            { label: 'Estrategia 3: Dos Caminos Energéticos (Estudio de Casos)', slug: 'estrategias/estrategia-3-dos-caminos' },
            { label: 'Estrategia 4: Cumbre Climática (Simulador COP)', slug: 'estrategias/estrategia-4-cumbre-cop' },
            { label: 'Estrategia 5: Transición Posible (Reto ABP)', slug: 'estrategias/estrategia-5-transicion-posible' },
            { label: 'Estrategia 6: Tribunal Ciudadano del Clima', slug: 'estrategias/estrategia-6-tribunal-ciudadano' },
          ],
        },
        {
          label: '03. Evaluación y Validación',
          items: [
            { label: 'Prueba Saber 11 (Tipo ICFES)', slug: 'evaluacion/prueba-saber-11' },
            { label: 'Prueba Piloto & Escala TAM/SUS (88.5/100)', slug: 'evaluacion/prueba-piloto-resultados' },
            { label: 'Pasaporte y Certificado Oficial', slug: 'evaluacion/pasaporte-climatico' },
          ],
        },
        {
          label: '04. Recursos Complementarios',
          items: [
            { label: 'Guía Docente Metodológica', slug: 'recursos/guia-docente' },
            { label: 'Dossier Documental & APA 7', slug: 'recursos/dossier-documental' },
            { label: 'Presentación Interactiva UTB', slug: 'recursos/presentacion-proyecto' },
          ],
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/libiasa56-ctrl/ova-cambio-climatico',
        },
      ],
    }),
  ],
});
