const { exec } = require("child_process");
const path = require("path");

// Resolve the absolute path to the debug folder
const debugFolder = path.resolve(
    __dirname,
    "android",
    "app",
    "build",
    "outputs",
    "apk",
    "debug"
);

// Open the folder in Windows Explorer
exec(`explorer "${debugFolder}"`, (error) => {
    if (error) {
        console.error(`Failed to open folder: ${error.message}`);
    }
});
