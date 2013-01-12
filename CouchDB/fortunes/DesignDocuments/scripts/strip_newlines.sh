#Bash script that strips newline characters from file specified by first command line argument,
#  then stores results in file specified by second command line argument.
#
#Used for converting human readable CouchDB design document into one which is valid JSON
sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/ /g' $1 > $2
