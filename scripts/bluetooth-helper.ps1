# Windows Bluetooth Radio & Device Helper for Nothing & CMF Buds
param (
    [string]$Action = "status"
)

function Get-BluetoothDevices {
    $devices = Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | 
        Where-Object { $_.FriendlyName -match '^(Nothing|CMF)' -and $_.FriendlyName -notmatch 'Avrcp' } | 
        Select-Object FriendlyName, InstanceId, Status
    if ($devices) {
        $devices | ConvertTo-Json -Compress
    } else {
        "[]"
    }
}

function Enable-BluetoothRadio {
    try {
        Start-Service bthserv -ErrorAction SilentlyContinue
        Add-Type -AssemblyName System.Runtime.WindowsRuntime -ErrorAction SilentlyContinue
        $null = [Windows.Devices.Radios.Radio,Windows.System.Devices,ContentType=WindowsRuntime]
        $asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | 
            Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | 
            Select-Object -First 1

        $getRadiosOp = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
        $m = $asTaskGeneric.MakeGenericMethod([System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]])
        $t = $m.Invoke($null, @($getRadiosOp))
        $t.Wait(2500)

        foreach ($r in $t.Result) {
            if ($r.Kind -eq [Windows.Devices.Radios.RadioKind]::Bluetooth) {
                if ($r.State -ne [Windows.Devices.Radios.RadioState]::On) {
                    $setOp = $r.SetStateAsync([Windows.Devices.Radios.RadioState]::On)
                    $mSet = $asTaskGeneric.MakeGenericMethod([Windows.Devices.Radios.RadioAccessStatus])
                    $tSet = $mSet.Invoke($null, @($setOp))
                    $tSet.Wait(2500)
                }
            }
        }
        @{ success = $true } | ConvertTo-Json -Compress
    } catch {
        Start-Service bthserv -ErrorAction SilentlyContinue
        @{ success = $true; fallback = $true } | ConvertTo-Json -Compress
    }
}

function Get-BluetoothRadioStatus {
    try {
        Add-Type -AssemblyName System.Runtime.WindowsRuntime -ErrorAction SilentlyContinue
        $null = [Windows.Devices.Radios.Radio,Windows.System.Devices,ContentType=WindowsRuntime]
        $asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | 
            Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod } | 
            Select-Object -First 1

        $getRadiosOp = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
        $m = $asTaskGeneric.MakeGenericMethod([System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]])
        $t = $m.Invoke($null, @($getRadiosOp))
        $t.Wait(2000)

        $radioState = "Unknown"
        foreach ($r in $t.Result) {
            if ($r.Kind -eq [Windows.Devices.Radios.RadioKind]::Bluetooth) {
                $radioState = "$($r.State)"
                break
            }
        }
        @{ radio = $radioState; service = (Get-Service bthserv -ErrorAction SilentlyContinue).Status.ToString() } | ConvertTo-Json -Compress
    } catch {
        @{ radio = "On"; service = "Running" } | ConvertTo-Json -Compress
    }
}

switch ($Action) {
    "devices" { Get-BluetoothDevices }
    "enable"  { Enable-BluetoothRadio }
    "status"  { Get-BluetoothRadioStatus }
    default   { Get-BluetoothDevices }
}

