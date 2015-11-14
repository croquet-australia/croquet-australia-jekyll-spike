@echo off
cd %~dp0..
set path=%cd%\tools\ruby\bin;%cd%\tools\ruby-devkit\bin;%path%
cd source
cmd /k
