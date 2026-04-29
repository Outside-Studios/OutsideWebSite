@echo off
chcp 65001 >nul
title Outside Studio — Publicar Site

cd /d "C:\Users\LuizF\Proton Drive\BaekRuiso\My files\WebPage"

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     OUTSIDE STUDIO — PUBLICAR SITE  ║
echo  ╚══════════════════════════════════════╝
echo.

:: Verifica se há mudanças no index.html
git diff --quiet index.html
if %errorlevel%==0 (
    echo  [!] Nenhuma mudança detectada no index.html
    echo      O site já está atualizado no GitHub.
    echo.
    pause
    exit /b 0
)

:: Mostra o resumo das mudanças
echo  Mudanças detectadas:
git diff --stat index.html
echo.

:: Gera mensagem de commit com data/hora
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set DATA=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set HORA=%%a:%%b
set HORA=%HORA: =0%
set MSG=update: site atualizado em %DATA% %HORA%

echo  Mensagem do commit: %MSG%
echo.
echo  Publicando...
echo.

git add index.html
git commit -m "%MSG%"

if %errorlevel% neq 0 (
    echo.
    echo  [ERRO] Falha ao criar commit.
    pause
    exit /b 1
)

git pull --rebase origin main
git push origin main

if %errorlevel%==0 (
    echo.
    echo  ╔══════════════════════════════════════╗
    echo  ║   ✓  Site publicado com sucesso!     ║
    echo  ║      outsidehub.xyz                  ║
    echo  ╚══════════════════════════════════════╝
) else (
    echo.
    echo  [ERRO] Falha ao enviar para o GitHub.
    echo  Verifique sua conexão e tente novamente.
)

echo.
pause
