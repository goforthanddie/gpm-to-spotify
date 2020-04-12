# gpm-to-spotify
Migrate albums from Google Play Music to Spotify.

Since my GPM suscription decided to die sponatenously without any notice and due to my not being content with how Google does not develop the platform, I decided to try Spotify. Since I did not want to transfer all the albums by hand and I did not want to provide my credentials in addition to money to any service offering this, I decided to find my own solution. Here is me sharing it with you.

I tested this solution only for transfering complete albums from GPM to Spotify, nothing else.

What you need:

Browser with Tampermonkey http://tampermonkey.net/ to extract the data from GPM
bash with curl and jq to parse JSON to import the data in Spotify
