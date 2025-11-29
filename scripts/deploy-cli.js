const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const projectRoot = path.resolve(__dirname, '..');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
};

function log(msg, color = colors.reset) {
    console.log(`${color}${msg}${colors.reset}`);
}

function runCommand(command, cwd = projectRoot) {
    try {
        log(`\n> Running: ${command}`, colors.cyan);
        execSync(command, { stdio: 'inherit', cwd });
        return true;
    } catch (error) {
        log(`\n! Command failed: ${command}`, colors.red);
        return false;
    }
}

function checkEnvironment() {
    log("\n--- Checking Environment ---", colors.bright);
    const checks = [
        { name: 'Node.js', cmd: 'node --version' },
        { name: 'NPM', cmd: 'npm --version' },
        { name: 'Solana CLI', cmd: 'solana --version' },
        { name: 'Anchor CLI', cmd: 'anchor --version' },
        { name: 'Rust', cmd: 'cargo --version' }
    ];

    checks.forEach(check => {
        try {
            const output = execSync(check.cmd, { encoding: 'utf8' }).trim();
            log(`[✓] ${check.name}: ${output}`, colors.green);
        } catch (e) {
            log(`[X] ${check.name}: Not found`, colors.red);
            if (check.name === 'Solana CLI') {
                log(`    -> Install: https://docs.solanalabs.com/cli/install`, colors.yellow);
            }
            if (check.name === 'Anchor CLI') {
                log(`    -> Install: https://www.anchor-lang.com/docs/installation`, colors.yellow);
            }
        }
    });
}

function buildContracts() {
    log("\n--- Building Smart Contracts ---", colors.bright);
    if (runCommand('anchor build')) {
        log("\n[✓] Build Successful!", colors.green);

        // Sync keys
        log("\n--- Syncing Program Keys ---", colors.bright);
        runCommand('anchor keys sync');
    }
}

function deployContracts() {
    log("\n--- Deploying Smart Contracts ---", colors.bright);
    rl.question(`\nSelect Network:\n1. Devnet\n2. Mainnet (Real Money!)\nChoice [1]: `, (answer) => {
        const network = answer.trim() === '2' ? 'mainnet' : 'devnet';
        log(`\nDeploying to ${network.toUpperCase()}...`, colors.yellow);

        // Ensure Anchor.toml is using the correct provider
        // This is a simplified check, in reality we might want to edit Anchor.toml or pass flags
        const cmd = `anchor deploy --provider.cluster ${network}`;

        if (runCommand(cmd)) {
            log(`\n[✓] Deployment to ${network} Successful!`, colors.green);
        } else {
            log(`\n[X] Deployment Failed. Check your wallet balance and config.`, colors.red);
        }
        showMenu();
    });
}

function buildFrontend() {
    log("\n--- Building Frontend ---", colors.bright);
    if (runCommand('npm install', path.join(projectRoot, 'app')) &&
        runCommand('npm run build', path.join(projectRoot, 'app'))) {
        log("\n[✓] Frontend Build Successful!", colors.green);
    }
}

function showMenu() {
    console.log(`
${colors.bright}=== TRAP WARS DEPLOYER ===${colors.reset}
1. Check Environment
2. Build Smart Contracts (and sync keys)
3. Deploy Smart Contracts
4. Build Frontend
5. Exit
    `);
    rl.question('Select option: ', (answer) => {
        switch (answer.trim()) {
            case '1':
                checkEnvironment();
                showMenu();
                break;
            case '2':
                buildContracts();
                showMenu();
                break;
            case '3':
                deployContracts(); // Handles its own menu return
                break;
            case '4':
                buildFrontend();
                showMenu();
                break;
            case '5':
                rl.close();
                process.exit(0);
                break;
            default:
                log("Invalid option", colors.red);
                showMenu();
        }
    });
}

// Start
showMenu();
