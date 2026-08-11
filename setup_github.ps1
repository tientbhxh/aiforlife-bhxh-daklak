Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "     DANG THIET LAP MOI TRUONG GITHUB        " -ForegroundColor Cyan
Write-Host "=============================================`n" -ForegroundColor Cyan

Write-Host "1. Dang cai dat Git (Portable) de khong bi loi UAC..." -ForegroundColor Yellow
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/MinGit-2.45.2-64-bit.zip"
$zipPath = "$env:TEMP\MinGit.zip"
$extractPath = "C:\MinGit"

if (-not (Test-Path "C:\MinGit\cmd\git.exe")) {
    Invoke-WebRequest -Uri $gitUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    Remove-Item $zipPath
}
Write-Host "-> Cai dat Git hoan tat!`n" -ForegroundColor Green

# Update PATH for current session and user
$env:PATH = "C:\MinGit\cmd;C:\Program Files\GitHub CLI;" + $env:PATH
[Environment]::SetEnvironmentVariable("Path", $env:PATH, [EnvironmentVariableTarget]::User)

Write-Host "2. Xac thuc tai khoan GitHub..." -ForegroundColor Yellow
Write-Host "Mot trang web se duoc mo ra, vui long dang nhap GitHub va bam [Authorize github]." -ForegroundColor White

& "C:\Program Files\GitHub CLI\gh.exe" auth login --web --hostname github.com --git-protocol https

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host " HOAN TAT! Ban co the dong cua so nay." -ForegroundColor Green
Write-Host " Va dung quen nhan 'Da xong' cho toi tren Chat nhe!" -ForegroundColor Green
Write-Host "=============================================`n" -ForegroundColor Cyan

Read-Host "Bam Enter de thoat..."
