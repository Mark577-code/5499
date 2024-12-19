const fs = require('fs');
const path = require('path');

// 更新版本号
const packageJson = require('../package.json');
const newVersion = incrementVersion(packageJson.version);
packageJson.version = newVersion;

fs.writeFileSync(
    path.join(__dirname, '../package.json'),
    JSON.stringify(packageJson, null, 2)
);

function incrementVersion(version) {
    const parts = version.split('.');
    parts[2] = parseInt(parts[2]) + 1;
    return parts.join('.');
}