For Linux/MacOS user, please run run.sh to generate a new adversary. Run simulate.sh for a new trace with same property and parameters.
For Windows user, please run run.bat to generate a new adversary. Run simulate.bat for a new trace with same property and parameters.

Simulator is written in javascript and HTML5.
Google Chrome works best with the simulator file which is located at '/traffic/index.html'.
Information of the trace for the simulator is stored at '/traffic/js/index.js'(***MacOS user might ecounter syntax error caused by the first few lines of codes).

Please allow a longer time for generating files using run.sh/run.bat
Use -javamaxmem __/-Xmx__ to increase the memory limit of Java Virtual Machine
e.g. prism -javamaxmem 4g in run.sh/ prism -Xmx8g -Xss1g in run.bat

Use -cuddmaxmem to increase CUDD memory
e.g. prism -cuddmaxmem 2g

Requirements
---------------------------
Python version 2.7 or above (v3.6.2 is used in development)
PRISM version 4.3.1 or above (v4.3.1 is used in development) 64-bit version preferred
Java 7 or above, 64-bit version preferred
Web browser(Google Chrome preferred)

Parameters to the script file
---------------------------
initial speed - recommended range is 0-10
near/far point distraction probability - recommended range is 0-1
assistive mode - true/false
property number - choose one from the property list, you can add properties to driver.pctl

File list
---------------------------
traffic(folder)                 All the files of the simulator
prism.bat                       Bat file for running command-line version of PRISM
xprism.bat                      For running PRISM GUI
run.sh                          Linux/MacOS script to generate new adversary, pick a trace and run the simulator 
simulate.sh                     Linux/MacOS script to pick a trace and run the simulator 
run.bat                         Windows script to generate new adversary, pick a trace and run the simulator
simulate.bat                    Windows script to pick a trace and run the simulator
javascript1.txt                 Part of the javascript file(without parameters for the experiment)
showprop.py			Python program to show the list of pre-defined properties
driver.pctl                     Property file for PRISM
driver.prism                    PRISM model file
genpath.py                      Python program to generate new trace
out.sta                         States list of the model exported from PRISM
out.tra                         Transition matrix of the model exported from PRISM
out1.srew                       State rewards file for cycle exported from PRISM
out2.srew                       State rewards file for time exported from PRISM
adv.tra                         Adversary file of the model exported from PRISM with default property
param.txt                       Containing parameters of the adversary file, generated from genpath.py
res.txt                         Probability of satisfying the default property, exported from PRISM
adv.txt                         Showing the trace of the most recent experiment, generated from genpath.py
README.txt                      This file
