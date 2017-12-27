file=$(cat -)

pre='# Hey Hello'
post='# Hey Good Bye'
replaced="# replacing"$'\n'"replace"$'\n'"# replaced"




start_marks=$(echo "${file}" | grep -n "${pre}" | sed 's/\(.*\):.*/\1/g')
end_marks=$(echo "${file}" | grep -n "${post}" | sed 's/\(.*\):.*/\1/g')
region_start="$( echo "${start_marks}" | head -1 )"
region_end="$end_marks"
while [ ! -z "${region_start}" ] && [ ! -z "${region_end}" ] && [ "$( echo "${region_end}" | head -1 )" -lt "${region_start}" ]; do
	echo "iterate: ${region_start} ${region_end}"
	region_end="$( echo "${region_end}" | tail -n +2 )"
done;
region_end="$( echo "${region_end}" | head -1 )"



echo; echo "region_start: ${region_start}"; echo "region_end: ${region_end}"
if [ -z "${region_start}" ] || [ -z "${region_end}" ]; then
	echo "append"
	echo
	echo
	echo
	cat <(echo "${file}") <(echo "${replaced}")
else
	echo "replace ${region_start} to ${region_end}"
	echo
	echo
	echo
	cat <(echo "${file}" | head -n $((region_start-1))) <(echo "${replaced}") <(echo "${file}" | tail -n +$((region_end+1)))
fi;
