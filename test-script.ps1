#!/usr/bin/env pwsh
$env:SPECIFY_FEATURE='001-focus-flow'
cd .specify/scripts/powershell
.\check-prerequisites.ps1 -PathsOnly
