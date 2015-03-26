rm ocpc.nw
zip -r ocpc.nw * -x "apps/*" "build.sh"
~/Application/nw/nw ocpc.nw --remote-debugging-port=2600
