echo "stop server"
forever stop ../server/bin/www
echo "killl process"
ps -ef|grep crawler|grep -v grep|cut -c 9-15|xargs kill -9