$ErrorActionPreference = 'Stop'
$fontDirectory = Join-Path $PSScriptRoot '../src/assets/fonts'
New-Item -ItemType Directory -Path $fontDirectory -Force | Out-Null

$files = @{
  'eb-garamond-regular.ttf' = 'https://fonts.gstatic.com/s/ebgaramond/v33/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUAw.ttf'
  'eb-garamond-semibold.ttf' = 'https://fonts.gstatic.com/s/ebgaramond/v33/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-NfNUAw.ttf'
  'eb-garamond-italic.ttf' = 'https://fonts.gstatic.com/s/ebgaramond/v33/SlGFmQSNjdsmc35JDF1K5GRwUjcdlttVFm-rI7e8QI96.ttf'
  'inter-regular.ttf' = 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf'
  'inter-semibold.ttf' = 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf'
  'EB-Garamond-OFL.txt' = 'https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/OFL.txt'
  'Inter-OFL.txt' = 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt'
}

foreach ($file in $files.GetEnumerator()) {
  Invoke-WebRequest -Uri $file.Value -OutFile (Join-Path $fontDirectory $file.Key) -UseBasicParsing
  Write-Output ('Saved ' + $file.Key)
}
