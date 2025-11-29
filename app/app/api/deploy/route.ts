import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST() {
    try {
        // 1. Run Build
        console.log("Starting build...");
        await new Promise((resolve, reject) => {
            exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Build error: ${error}`);
                    reject(error);
                    return;
                }
                console.log(`Build stdout: ${stdout}`);
                resolve(stdout);
            });
        });

        // 2. Open Output Folder in Explorer
        const outPath = path.join(process.cwd(), 'out');
        exec(`explorer "${outPath}"`);

        // 3. Open Netlify Drop in Browser
        exec('start https://app.netlify.com/drop');

        return NextResponse.json({ success: true, message: "Build complete. Folder and Drop site opened." });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Deployment sequence failed." }, { status: 500 });
    }
}
