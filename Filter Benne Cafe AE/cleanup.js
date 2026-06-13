const fs = require('fs');
const path = require('path');

const publicAssetsDir = path.join(__dirname, 'public', 'assets');
const srcDir = path.join(__dirname, 'src');
const indexHtmlPath = path.join(__dirname, 'index.html');

const assets = fs.readdirSync(publicAssetsDir);

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const sourceFiles = [...getAllFiles(srcDir), indexHtmlPath];
const sourceContents = sourceFiles.map(f => fs.readFileSync(f, 'utf8'));

const unusedAssets = [];
for (const asset of assets) {
  let used = false;
  for (const content of sourceContents) {
    if (content.includes(asset)) {
      used = true;
      break;
    }
  }
  if (!used) {
    unusedAssets.push(asset);
  }
}

console.log('Unused assets:');
unusedAssets.forEach(a => console.log(a));

// Delete unused assets
for (const asset of unusedAssets) {
  const assetPath = path.join(publicAssetsDir, asset);
  fs.unlinkSync(assetPath);
  console.log(`Deleted: ${asset}`);
}
