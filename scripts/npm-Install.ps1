# Installs bower packages and Jekyll tools
# 
# npm-Install.ps1 is called by npm when npm install is run.

Function Main()
{
	Write-AzureHost "Installing tools..."

    $toolsDirectory = Get-ToolsDirectory
    $initialErrorActionPreference = $ErrorActionPreference
    $initialProgressPreference = $ProgressPreference

    $ErrorActionPreference = "Stop"

    # Azure's deployment console cannot write to the console
    $ProgressPreference = "SilentlyContinue"
    
    Try {
        Install-BowerPackages
        Confirm-JekyllToolsAreInstalled -ToolsDirectory $ToolsDirectory
    }
    Catch {
        Write-AzureHost $_
        
        If ($lastexitcode -ne 0) {
            exit $lastexitcode            
        }
        exit 1
    }
    Finally {
        $ErrorActionPreference = $initialErrorActionPreference
        $ProgressPreference = $initialProgressPreference
    }
}

# Get the directory to install tools into.
#
# If environment variable DEPLOYMENT_TOOLS is defined then that value is used.
# Otherwise <repository>\tools directory is used.
#
# Typically DEPLOYMENT_TOOLS is only defined by deploy.cmd that is used during
# Azure deployment. 
Function Get-ToolsDirectory()
{
    $toolsDirectory = $env:DEPLOYMENT_TOOLS
    
    If ($toolsDirectory -ne $null)
    {
        return $toolsDirectory
    }
    
    return "$PSScriptRoot\..\tools"
}

Function Install-BowerPackages()
{
    Write-AzureHost "Installing bower packages..."
    & bower install
    
    If ($lastexitcode -ne 0) {
        throw "bower install failed '$lastexitcode'."
    }    
}

Import-Module $PSScriptRoot\library\Library.psm1 -Force -ErrorAction Stop
Main
