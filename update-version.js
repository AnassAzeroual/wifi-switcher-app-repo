const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process'); // Import for running git commands

// Function to increment the version number
function incrementVersion(version) {
  const parts = version.split(".").map(Number);
  parts[2] += 1; // Increment patch version
  return parts.join(".");
}

// Read package.json
const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
let appVersion = packageJson.version;

// Increment the version
appVersion = incrementVersion(appVersion);

// Update package.json with the new version
packageJson.version = appVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

console.log(`Updated package.json version to ${appVersion}`);

// Paths to environment files
const envFilePaths = [
  path.join(__dirname, "src", "environments", "environment.ts"),
  path.join(__dirname, "src", "environments", "environment.prod.ts"),
];

envFilePaths.forEach((envFilePath) => {
  let envFileContent = fs.readFileSync(envFilePath, "utf8");

  // Replace or add the version property
  const versionRegex = /version:\s*['"]([^'"]+)['"]/;
  if (versionRegex.test(envFileContent)) {
    // Update existing version
    envFileContent = envFileContent.replace(
      versionRegex,
      `version: '${appVersion}'`
    );
  } else {
    // Add version if not found
    envFileContent = envFileContent.replace(
      /export\s+const\s+environment\s+=\s+\{/,
      `export const environment = {\n  version: '${appVersion}',`
    );
  }

  // Write the updated content back to the file
  fs.writeFileSync(envFilePath, envFileContent, "utf8");
});

console.log(`Updated environment files with version ${appVersion}`);

// Path to build.gradle
const buildGradlePath = path.join(__dirname, "android", "app", "build.gradle");

// Read build.gradle
let buildGradleContent = fs.readFileSync(buildGradlePath, "utf8");

// Update versionName in build.gradle
const versionNameRegex = /versionName\s+["']([^"']+)["']/;
if (versionNameRegex.test(buildGradleContent)) {
  // Update existing versionName
  buildGradleContent = buildGradleContent.replace(
    versionNameRegex,
    `versionName "${appVersion}"`
  );
} else {
  // Add versionName if not found
  buildGradleContent = buildGradleContent.replace(
    /defaultConfig\s+\{/,
    `defaultConfig {\n        versionName "${appVersion}"`
  );
}

// Write the updated content back to build.gradle
fs.writeFileSync(buildGradlePath, buildGradleContent, "utf8");

console.log(`Updated build.gradle versionName to ${appVersion}`);


// Create Git tag
try {
  execSync(`git tag v${appVersion} -a -m "Release v${appVersion}"`); // Annotated tag
  console.log(`Created Git tag v${appVersion}`);
} catch (error) {
  console.error(`Error creating Git tag: ${error.message}`);
  // Handle the error appropriately, e.g., exit the script
  process.exit(1); // Example: Exit with an error code
}

// Optional: Push the tag (uncomment if needed)
// try {
//   execSync('git push --tags');
//   console.log('Pushed tags to remote repository.');
// } catch (error) {
//   console.error(`Error pushing tags: ${error.message}`);
// }