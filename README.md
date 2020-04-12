# gpm-to-spotify
Migrate albums from Google Play Music to Spotify.

Since my GPM suscription decided to die sponatenously without any notice and due to my not being content with how Google does not develop the platform, I decided to try Spotify. Since I did not want to transfer all the albums by hand and I did not want to provide my credentials in addition to money to any service offering this, I decided to find my own solution. Here is me sharing it with you.

I tested this solution only for transfering complete albums from GPM to Spotify, nothing else.

What you need:

- Browser with Tampermonkey http://tampermonkey.net/ to extract the data from GPM
- ```bash``` with ```curl``` and ```jq``` to parse JSON to import the data in Spotify

Step by step:

1. Install Tampermonkey and copy content from [```exportFromGPM.js```](https://github.com/goforthanddie/gpm-to-spotify/blob/master/exportFromGPM.js) into a new script.

2. Visit https://play.google.com/music/listen#/albums and wait until your library is loaded. Hit "Scrape data!" in the bottom right hand corner. Wait until it has scrolled down and reads "Scrape again!"

3. Paste your clipboard content, which should now contain the list of your albums, into a new file, e.g., ```gpm.txt``` on wherever you are able to execute a ```bash``` script.

4. Configure [```importToSpotify.sh```](https://github.com/goforthanddie/gpm-to-spotify/blob/master/importToSpotify.sh) and 
    1. set ```spotifyUser``` to your Spotify account name which you obtain from the account overview page. This might differ from the name in the top right hand corner.
    2. obtain your access token by visiting https://open.spotify.com/ open your browser's webdeveloper console go to the network tab, right click to open some context menu or obtain the access token from the request headers of a previous request as shown in the following image. The word "Bearer" is part of the token. Set ```accessToken``` to the token.
![alttext](https://www.hotel666.de/tmp/2020/0412/spotify-token.png)
    3. For some reason it needs your country code in ```countryCode``` for the search results, I do not know what is the effect of that ;) so feel free to figuring it out.
    4. Set the name of your file with the GPM export results in ```fileGPM```.
    5. I picked a sleep interval in ```sleepInterval``` as 0.1 seconds, just to make sure it does not get banned or so.
    6. Variable ```resCategory``` defines what category from the results is being used to select the first hit from and add it to your library.

5. Run ```importToSpotify.sh``` and maybe divert output to some text file in case some albums are not found.
