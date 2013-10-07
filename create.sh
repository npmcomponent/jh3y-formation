#!/bin/bash
echo 'Lets create a component'
echo 'Your components name will be?'
read x
component_name=$x
echo Lets scaffold out $component_name.
promptyn () {
    while true; do
        read -p "$1 " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}
if promptyn "Do you have a particular filename you wish to use?"; then
	echo "What filename do you wish to use? (.js will be appended to this)"
	read x
	filename=$x".js"
else
	echo $component_name".js will be the ouput filename"
	filename=$component_name".js"
fi
echo "module.exports = "$component_name";" > $filename
if promptyn "Does $component_name have any parameters?"; then
	echo $component_name has parameters
	echo "What are those parameters? (string seperated by space)"
	read x
	params=`echo $x | sed -E 's/[[:space:]]+/, /g'`
	echo "" >> $filename
	echo "function" $component_name"("$params") {" >> $filename
	echo "	if (!(this instanceof "$component_name")) return new "$component_name"("$params");" >> $filename
	paramsToProps=( $x )
	for i in "${paramsToProps[@]}"
	do
		echo $i
	done
else
	echo $component_name has no parameters
	echo "" >> $filename
	echo "function" $component_name"() {" >> $filename
	echo "	if (!(this instanceof "$component_name")) return new "$component_name"();" >> $filename
fi
if promptyn "are there defaults for this component?"; then
	echo "	this.defaults = {};" >> $filename
	echo "}" >> $filename
fi
if promptyn "Does $component_name have any functions?"; then
	echo $component_name has functions
	echo "what are the names of those functions? (strings seperated by space)"
	read x
	echo scaffolding functions $x for $component_name
	component_functions=( $x )
	for i in "${component_functions[@]}"
	do
		echo $component_name".prototype."$i" = function () {" >> $filename
		echo "" >> $filename
		echo "}" >> $filename
	done
else
	echo $component_name has no functions
fi
echo "}" >> $filename
echo ""
echo file $filename created for $component_name