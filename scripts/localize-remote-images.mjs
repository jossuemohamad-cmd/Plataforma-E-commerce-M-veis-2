import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'images', 'catalog');
const sourceRoots = [path.join(root, 'src')];
const extraFiles = [path.join(root, 'supabase', 'seed.sql')];
const remoteImagePattern = /https:\/\/(?:lh3\.googleusercontent\.com|images\.unsplash\.com)\/[^'"`\s)]+/g;

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(absolutePath));
    if (entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name)) files.push(absolutePath);
  }

  return files;
}

function extensionFor(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

await mkdir(outputDir, { recursive: true });

const sourceFiles = (await Promise.all(sourceRoots.map(collectSourceFiles))).flat();
const files = [...sourceFiles, ...extraFiles];
const contents = new Map();
const urls = new Set();

for (const file of files) {
  const content = await readFile(file, 'utf8');
  contents.set(file, content);
  for (const match of content.matchAll(remoteImagePattern)) urls.add(match[0]);
}

const replacements = new Map();
const queue = [...urls];

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Falha ao descarregar imagem (${response.status}): ${url}`);

    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    if (!contentType.startsWith('image/')) throw new Error(`Resposta não é imagem: ${url}`);

    const extension = extensionFor(contentType);
    const filename = `${createHash('sha256').update(url).digest('hex').slice(0, 20)}.${extension}`;
    const publicPath = `/images/catalog/${filename}`;
    await writeFile(path.join(outputDir, filename), Buffer.from(await response.arrayBuffer()));
    replacements.set(url, publicPath);
  }
}

await Promise.all(Array.from({ length: Math.min(6, queue.length) }, () => worker()));

let changedFiles = 0;
for (const [file, original] of contents) {
  let updated = original;
  for (const [url, localPath] of replacements) updated = updated.split(url).join(localPath);
  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Imagens locais: ${replacements.size}; ficheiros atualizados: ${changedFiles}`);
