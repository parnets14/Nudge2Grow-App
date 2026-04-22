const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const logoPath = path.join(__dirname, 'src/assets/images/logo.jpeg');
const resPath = path.join(__dirname, 'android/app/src/main/res');

async function generateIcons() {
  console.log('🎨 Generating launcher icons...\n');
  
  for (const [folder, size] of Object.entries(sizes)) {
    const outputDir = path.join(resPath, folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'ic_launcher.png');
    
    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${folder}/ic_launcher.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to create ${folder}/ic_launcher.png:`, error.message);
    }
  }
  
  console.log('\n🎉 All launcher icons generated successfully!');
  console.log('\nNow run: cd android && ./gradlew assembleRelease');
}

generateIcons().catch(console.error);
