#!/bin/bash
port=7070
pid=$(lsof -t -i:$port)
if [[ -z $pid ]]
   then
      echo "The game was not running."
   else
      kill -9 $pid
fi

cd dist
python3 -m http.server $port
