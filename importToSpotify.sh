#!/bin/bash

spotifyUser="yourspotifyaccount" # the one from your account page which is not necessarily the one displayed in the top right hand corner
accessToken="youraccesstoken"
fileGPM="gpm.txt"
sleepInterval=0.1 # in seconds between adding two albums
resCategory="albums" # or topHit

for searchString in `cat ${fileGPM}`; do
	echo -n "Searching ${searchString}:"

	searchRes=`curl -s "https://spclient.wg.spotify.com/searchview/km/v4/search/${searchString}?entityVersion=2&catalogue=&country=DE" -H "authorization: ${accessToken}" --compressed`

	searchResError=`echo ${searchRes} | jq -j .error`
	if [[ "${searchResError}" == "" || "${searchResError}" == "null" ]]; then
		searchResTotal=`echo ${searchRes} | jq -j .results.${resCategory}.total`
		if [[ "${searchResTotal}" == "null" || $searchResTotal == 0 ]]; then
			echo " Failed: 0 results returned."
			continue;
		else
			echo " Ok!"
		fi
	else
		searchResErrorMessage=`echo ${searchRes} | jq -j .error.message`
		searchResErrorStatus=`echo ${searchRes} | jq -j .error.status`
		echo " Failed: ${searchResErrorMessage}"
		if [[ $searchResErrorStatus == 401 ]]; then
			echo " Aborting."
			exit 1;
		fi
	fi


	searchResId=`echo ${searchRes} | jq -j .results.${resCategory}.hits[0].uri`
	searchResIdSolo=${searchResId##*:} # remove everything prior to the last colon :
	searchResArtist=`echo ${searchRes} | jq -j .results.${resCategory}.hits[0].artists[0].name`
	searchResAlbum=`echo ${searchRes} | jq -j .results.${resCategory}.hits[0].name`

	echo -n "Adding ${searchResArtist} - ${searchResAlbum} with id: ${searchResIdSolo} to library:"
	addRes=`curl -s "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/${spotifyUser}?base62ids=${searchResIdSolo}&model=bookmark" -X PUT -H "authorization: ${accessToken}" --compressed`

	addResError=`echo ${addRes} | jq -j .error`
	if [[ "${addResError}" == "" || "${addResError}" == "null" ]]; then
		echo " Ok!"
	else
		addResErrorMessage=`echo ${addRes} | jq -j .error.message`
		addResErrorStatus=`echo ${addRes} | jq -j .error.status`
		echo " Failed: ${addResErrorMessage}"
		if [[ $addResErrorStatus == 401 ]]; then
			echo " Aborting."
			exit 1;
		fi
	fi
	sleep $sleepInterval
done
