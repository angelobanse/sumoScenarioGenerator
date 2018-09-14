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
