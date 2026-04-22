// Quick fix: Use the default React Native launcher icon
// Run: node generate-icons.js

const fs = require('fs');
const path = require('path');

// For now, let's just update the AndroidManifest to use a simpler icon approach
const manifestPath = path.join(__dirname, 'android/app/src/main/AndroidManifest.xml');
let manifest = fs.readFileSync(manifestPath, 'utf8');

// Comment out the round icon
manifest = manifest.replace(
  'android:roundIcon="@mipmap/ic_launcher_round"',
  '<!-- android:roundIcon="@mipmap/ic_launcher_round" -->'
);

fs.writeFileSync(manifestPath, manifest);
console.log('✅ Updated AndroidManifest.xml to remove round icon reference');
console.log('\nNext steps:');
console.log('1. Generate proper icons using: https://icon.kitchen/');
console.log('2. Or use: npx react-native set-icon --path ./src/assets/images/logo.jpeg');
