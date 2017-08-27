@echo off
set /p ini="Enter the initial speed: "
set /p near="Enter the probability of driver being distracted while monitoring near point: "
set /p far="Enter the probability of driver being distracted while monitoring far point: "
set /p assist="Turn assistive mode on(true/false)? "
call python.exe showprop.py
set /p prop="Enter the property number: "
call prism driver.prism -const assist_mode=%assist%,near_distracted_prob=%near%,far_distracted_prob=%far%,initial_speed=%ini% -exportmodel out.sta,srew,tra driver.pctl -prop %prop% -exportresults res.txt -exportadv adv.tra
call python.exe genpath.py %prop% %ini% %near% %far% %assist%
call START "" "%~dp0traffic\index.html"
cmd /k