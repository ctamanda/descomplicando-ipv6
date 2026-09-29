import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { loaderPartes, loaderSecoes } from './lib/conteudo/loader-manual';
import { loaderPaginas } from './lib/conteudo/loader-paginas';

const secoes = defineCollection({
  loader: loaderSecoes(),
  schema: z.object({
    numero: z.string(),
    titulo: z.string(),
    slug: z.string(),
    ordem: z.number(),
    parte: z.number(),
    parteTitulo: z.string(),
  }),
});

const partes = defineCollection({
  loader: loaderPartes(),
  schema: z.object({
    numero: z.number(),
    titulo: z.string(),
    descricao: z.string(),
    secoes: z.array(z.string()),
  }),
});

const paginas = defineCollection({
  loader: loaderPaginas(),
  schema: z.object({ titulo: z.string() }),
});

export const collections = { secoes, partes, paginas };
