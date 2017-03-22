{ # try
    echo "stop server"
    forever stop ../server/bin/www
    echo "killl process"
    ps -ef|grep crawler|grep -v grep|cut -c 9-15|xargs kill -9
} || { # catch
    # save log for exception 
    echo "err"
}

clear
if [ "$1" = "-dev" ]; then  

    npm run debug

elif [ "$1" = "-sim" ]; then

    npm run sim-forever

elif [ "$1" = "-pro" ]; then

    npm start
else
    
    echo "usage:"
    echo "  sh start.sh ACTION"
    echo ""

    echo "ACTION:"
    echo "  -dev: start server in dev-env"
    echo "  -sim: start server in sim-env"
    echo "  -pro: start server in pro-env"
    echo ""
    
    echo "etc: sh start.sh -dev"
fi  