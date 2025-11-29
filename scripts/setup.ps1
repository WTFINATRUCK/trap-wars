# Trap Wars Setup Script
Write-Host "Initializing Trap Wars Environment..." -ForegroundColor Cyan

# Function to check command availability
function Test-Command ($command) {
    return (Get-Command $command -ErrorAction SilentlyContinue) -ne $null
}

# 1. Check Node.js
if (-not (Test-Command "node")) {
    Write-Host "[X] Node.js not found. Installing via Winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS -e --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Failed to install Node.js. Please install manually." -ForegroundColor Red
    }
} else {
    Write-Host "[OK] Node.js is installed." -ForegroundColor Green
}

# 2. Check Rust (Required for Anchor)
if (-not (Test-Command "cargo")) {
    Write-Host "[X] Rust not found. Please install Rust manually from https://rustup.rs/" -ForegroundColor Red
    Write-Host "    (Automated Rust install on Windows is complex due to MSVC requirements)" -ForegroundColor Gray
} else {
    Write-Host "[OK] Rust is installed." -ForegroundColor Green
}

# 3. Check Solana CLI
if (-not (Test-Command "solana")) {
    Write-Host "[X] Solana CLI not found." -ForegroundColor Red
    Write-Host "    -> Run DEPLOYMENT_GUIDE.md instructions to install." -ForegroundColor Yellow
} else {
    Write-Host "[OK] Solana CLI is installed." -ForegroundColor Green
}

# 4. Install Project Dependencies
Write-Host "`nInstalling Project Dependencies..." -ForegroundColor Cyan
cd "$PSScriptRoot\..\app"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Frontend dependencies installed." -ForegroundColor Green
} else {
    Write-Host "[!] Frontend install failed." -ForegroundColor Red
}

# 5. Create Desktop Shortcut
$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Trap Wars Deployer.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\..\launch_deployer.bat"
$Shortcut.IconLocation = "shell32.dll,238" # Generic icon
$Shortcut.Save()
Write-Host "[OK] Desktop shortcut created." -ForegroundColor Green

Write-Host "`nSetup Complete!" -ForegroundColor Cyan
Read-Host "Press Enter to exit..."
