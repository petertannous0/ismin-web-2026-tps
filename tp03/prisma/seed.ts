/**
 * Populates the database from `data/models.json`.
 *
 *   npm run db:seed
 */
import { readFile } from 'node:fs/promises';
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

interface ModelSeed {
  id: string;
  name: string;
  org: string;
  task: string;
  parameters: number;
  downloads: number;
}

async function main(): Promise<void> {
  const raw = await readFile('data/models.json', 'utf8');
  const models = JSON.parse(raw) as ModelSeed[];

  // ÉTAPE 1 : Créer les organisations AVANT les modèles (Le piège est évité !)
  // On utilise un Set pour ne garder que les organisations uniques (sans doublons)
  const uniqueOrgs = [...new Set(models.map(m => m.org))];
  
  for (const org of uniqueOrgs) {
    await prisma.organisation.upsert({
      where: { slug: org },
      create: { slug: org, name: org }, // On met le slug en guise de nom
      update: {}, // Si elle existe déjà, on ne change rien
    });
  }

  // ÉTAPE 2 : Créer les modèles en les connectant à leur orga
  for (const model of models) {
    // On reformate les données pour la nouvelle base de données
    const modelData = {
      id: model.id,
      name: model.name,
      task: model.task,
      parameters: model.parameters,
      downloads: model.downloads,
      organisation: {
        connect: { slug: model.org }, // On connecte à l'orga correspondante
      },
    };

    await prisma.model.upsert({
      where: { id: model.id },
      create: modelData,
      update: modelData,
    });
  }

  console.log(`✅ ${uniqueOrgs.length} organisations insérées`);
  console.log(`✅ ${models.length} modèles insérés`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());