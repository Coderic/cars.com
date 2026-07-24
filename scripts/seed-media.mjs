#!/usr/bin/env node
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "cars-com";
const TMP = join(ROOT, ".tmp", "seed-media");

const VEHICLE_IMAGES = [
  { codigo: "toyota-corolla-2019", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "mazda-cx5-2021", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "chevrolet-spark-2018", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "ford-ranger-2020", url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "hyundai-tucson-2022", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "kia-rio-2017", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "nissan-kicks-2020", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "volkswagen-jetta-2019", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "renault-duster-2021", url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "bmw-x1-2018", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "toyota-hilux-2019", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "chevrolet-onix-2020", url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "honda-civic-2020", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "jeep-compass-2021", url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "suzuki-swift-2019", url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "mitsubishi-l200-2019", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "mercedes-clase-a-2020", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "peugeot-3008-2021", url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "chery-tiggo-7-2022", url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "mazda-3-2020", url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "subaru-forester-2019", url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80&auto=format&fit=crop" },
  { codigo: "volvo-xc40-2021", url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80&auto=format&fit=crop" },
];

const remote = process.argv.includes("--remote");
const dryRun = process.argv.includes("--dry-run");
const onlyNew = process.argv.includes("--new");

const NEW_CODIGOS = new Set([
  "toyota-hilux-2019", "chevrolet-onix-2020", "honda-civic-2020", "jeep-compass-2021",
  "suzuki-swift-2019", "mitsubishi-l200-2019", "mercedes-clase-a-2020", "peugeot-3008-2021",
  "chery-tiggo-7-2022", "mazda-3-2020", "subaru-forester-2019", "volvo-xc40-2021",
]);

const imagesToSeed = onlyNew
  ? VEHICLE_IMAGES.filter((item) => NEW_CODIGOS.has(item.codigo))
  : VEHICLE_IMAGES;

function putObject(key, localPath) {
  if (dryRun) return Promise.resolve();
  const args = [
    "wrangler",
    "r2",
    "object",
    "put",
    `${BUCKET}/${key}`,
    "--file",
    localPath,
    "--content-type",
    "image/jpeg",
  ];
  if (remote) args.push("--remote");
  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("close", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(stderr || `exit ${code}`));
    });
  });
}

async function main() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  console.log(`Seeding ${imagesToSeed.length} vehicle images to R2 bucket ${BUCKET}${remote ? " (remote)" : " (local)"}…`);
  for (const item of imagesToSeed) {
    const key = `vehicles/${item.codigo}.jpg`;
    const localPath = join(TMP, `${item.codigo}.jpg`);
    if (!dryRun) {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`Failed to download ${item.codigo}: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(localPath, buf);
    }
    await putObject(key, localPath);
    console.log(`  ✓ ${key}`);
  }
  rmSync(TMP, { recursive: true, force: true });
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
