# Olaf Angelo Banse - 2018

# This script deletes .ZIP files older than 24hours
# This script should be invoked every couple of hours by a CRON JOB
import time
import os

epoch_now = time.time() # current time

# PATH where the ZIP files are being stored
directory = os.path.join(os.getcwd() , "cgi-bin/") # look carefully the path
# os.getcwd() gives you the path where this script (deleter.py) is located

desired_time_limit = epoch_now - (24 * 3600) # desired_time_limit is epoch_now minus 24 hours (in seconds)
os.chdir(directory)

for zipFiles in os.listdir('.'):
    if os.stat(os.path.join(directory, zipFiles)).st_mtime < desired_time_limit and zipFiles.endswith(".zip"):
        os.remove(zipFiles)
    else:
        pass