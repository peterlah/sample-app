@echo Starting dockerd in WSL ...
@echo off
for /f "tokens=1" %%a in ('wsl sh -c "hostname -I"') do set wsl_ip=%%a
netsh interface portproxy add v4tov4 listenport=2375 connectport=2375 connectaddress=%wsl_ip%
wsl -d Ubuntu -u root -e nohup sh -c "dockerd -H tcp://%wsl_ip% &" < nul > nul 2>&1