
n() {
    'use strict';

    var outText = "";
    var allAlbums = []

    var divBottomRight = document.createElement('div');
    divBottomRight.setAttribute('id', 'scrapeData');
    divBottomRight.style.position = 'fixed';
    divBottomRight.style.bottom = 0;
    divBottomRight.style.right = 0;
    divBottomRight.style.cursor = 'pointer';
    divBottomRight.innerHTML = 'Scrape data!';

    document.querySelector('body').appendChild(divBottomRight);

    var copyToClipboard = function(str) {
        var textareaCopy = document.createElement('textarea');
        textareaCopy.value = '';
        textareaCopy.setAttribute('readonly', '');
        textareaCopy.setAttribute('id', 'copyMe');
        textareaCopy.style.position = 'absolute';
        textareaCopy.style.left = '-9999px';
        document.querySelector('body').appendChild(textareaCopy);
        document.getElementById('copyMe').value = str;
        document.getElementById('copyMe').select();
        document.execCommand('copy');
    };

    var songsToSpotifySearchStringArray = function(skipDublicates) {
        var numEntries = 0;
        var seen = {};
        for (var i = 0; i < allAlbums.length; i++) {
            var curr = '';
            curr += encodeURI(allAlbums[i].artist + ' ' + allAlbums[i].album);
            if (!seen.hasOwnProperty(curr) || !skipDublicates) { // hashset
                outText = outText + curr + "\n";
                numEntries++;
                seen[curr] = true;
            } else {
                console.log("Skipping (duplicate) " + curr);
            }
        }
        copyToClipboard(outText);
        console.log("Done! " + numEntries + " lines copied to clipboard. Used " + numEntries + " songs out of " + allAlbums.length + ".");
        divBottomRight.innerHTML = 'Scrape again!';
    }

    var scrapeAlbums = function() {
        var intervalms = 1; //in ms
        var timeoutms = 3000; //in ms
        var retries = timeoutms / intervalms;
        var total = [];
        var currId = "";
        var seen = {};
        var detail = {};
        var topId = "";
        divBottomRight.innerHTML = 'Scraping...';
        var interval = setInterval(function() {
            var songs = document.querySelectorAll("div.lane-content div.material-card");
            if (songs.length > 0) {
                // check if page has updated/scrolled
                currId = songs[0].getAttribute("data-id");
                if (currId == topId) { // page has not yet changed
                    retries--;
                    var scrollDiv = document.querySelector("div#mainContainer");
                    var isAtBottom = scrollDiv.scrollTop == (scrollDiv.scrollHeight - scrollDiv.offsetHeight)
                    if (isAtBottom || retries <= 0) {
                        clearInterval(interval); //done
                        allAlbums = total;
                        allAlbums.sort();
                        console.log("Got " + total.length + " songs and stored them in the allAlbums variable.");
                        songsToSpotifySearchStringArray(false);
                    }
                } else {
                    retries = timeoutms / intervalms;
                    topId = currId;
                    // read page
                    console.log("Reading page with " + songs.length + " entries.");
                    for (var i = 0; i < songs.length; i++) {
                        currId = songs[i].getAttribute("data-id");
                        detail = document.querySelector("div.material-card[data-id='" + CSS.escape(currId) + "'] div.details-inner");
                        var curr = {
                            dataid: currId,
                            artist: detail.querySelector("a.sub-title").innerText,
                            album: detail.querySelector("a.title").innerText
                        }
                        console.log(songs[i].getAttribute("data-id"));
                        if (!seen.hasOwnProperty(curr.dataid)) { // hashset
                            total.push(curr);
                            seen[curr.dataid] = true;
                            console.log("Storing.");
                        } else {
                            console.log("Skipping, already seen.");
                        }
                    }
                    songs[songs.length - 1].scrollIntoView(true); // go to next page
                }
            } else {
                console.log("No songs found.");
            }
        }, intervalms);
    };

    document.getElementById('scrapeData').addEventListener('click', scrapeAlbums);
})();
