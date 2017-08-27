#!/bin/dash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
read -p "Enter the initial speed: " ini
read -p "Enter the probability of driver being distracted while monitoring near point: " near
read -p "Enter the probability of driver being distracted while monitoring far point: " far
read -p "Turn assistive mode on(true/false)? " assist
python showprop.py
read -p "Enter the property number: " prop
prism driver.prism -const assist_mode=$assist,near_distracted_prob=$near,far_distracted_prob=$far,initial_speed=$ini -exportmodel out.sta,srew,tra driver.pctl -prop $prop -exportadv adv.tra -exportresults res.txt
python genpath.py $prop $ini $near $far $assist
xdg-open ./traffic/index.html