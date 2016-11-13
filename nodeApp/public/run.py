import subprocess

cmds = [
    "git pull",
    "gulp",
    "subl ."
]
if False:
    print "Manual selection"
else:
    for cmd in cmds:
        query = cmd.split()
        process = subprocess.Popen(query, stdout=subprocess.PIPE)
        output = process.communicate()[0]
        print output
        if(query[0] == "gulp"):
            print "Server running at : http://localhost:9999"

print "Let's Get Cracking !"
