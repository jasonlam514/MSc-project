#!/bin/dash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
python genpath.py
open ./traffic/index.html