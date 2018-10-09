cgi-bin Directory
=======================
CGI (Common Gateway Interface), **cgi-bin** is a directory where web applications and scripts can run securely.



If you are running an Apache web server, make sure to follow these steps:

* Set the correct path to the cgi-bin directory 

In the ```httpd.conf``` (aso found sometimes as ```/etc/apache2/apache2.conf```) file set ```<Directory />``` to ```<Directory "/var/www/cgi-bin">``` and add the following line ```AddHandler cgi-script .cgi .py``` between the ```<Directory></Directory>``` tags.

Set your cgi-bin folder path in the ```/etc/apache2/conf-available/serve-cg-bin.conf``` configuration file

* Enable the CGI module in Apache

Set the symbolic link ```sudo ln -s ../mods-available/cgi.load to the etc/apache2/mods-enabled```

* Reload Apache

```sudo service apache2 reload```


Make sure the scripts are executable: ```sudo chmod +x```

## script.py

## deleter.py

User-generated `.ZIP files` are only being kept 24 hours on the server and then deleted.

The `deleter.py` script is in charge of deleting `.ZIP files` according to their *last modified* dates (default case in the script being 24 hours) to prevent filling the server.

`deleter.py` script must be invoked by a *Cron job*. Please verify that the specified *Path* under the `directory` variable (in the script) is correct. 

To create a *Cron job* enter `crontab -e` into the console.

An example *Cron job* that runs every 24 hours (exactly at midnight) looks like this:
```
0 0 * * * /usr/bin/python /home/public_html/cgi-bin/deleter.py
```
:warning: Please verify YOUR specific *PATH*

:warning: Make sure the script has the necessary permission (755)
