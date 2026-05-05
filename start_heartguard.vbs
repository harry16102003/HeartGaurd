Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectRoot = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run Chr(34) & projectRoot & "\start_heartguard.bat" & Chr(34), 0

