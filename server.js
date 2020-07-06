'use strict';
const express = require('express');
const morgan = require('morgan');


const { top50 } = require('./data/top50');

const PORT = process.env.PORT || 8000;

const app = express();

const topArtist = (top50) => {
    let artistArr = [];
    let topNum = 0;
    let topName, count;
    top50.forEach(song => {
        let artist = song.artist;
        let feat = song.artist.indexOf('featuring');
        if (feat > 0) artist = song.artist.slice(0, feat);
        if (!artistArr.includes(artist)) {
            count = 0;
            top50.forEach(hit => {
                let a = hit.artist;
                let f = hit.artist.indexOf('featuring');
                if (f > 0) a = hit.artist.slice(0, f);
                if (a === artist) count++;
            });            
            if (count > topNum) {
                topNum = count;
                topName = artist;
            }
            artistArr.push(artist);            
        }
    });
    return topName;
};

const mostPopular = top50.filter((song) => {
    return song.artist.includes(topArtist(top50));
});



let title, data;
const renderData = (id) => {
    if (id === 'top50') {
        title = 'Top 50 Songs Streamed on Spotify';
        data = top50;
    } else if (id === 'popular-artist'){
        title = 'Most popular artist';
        data = mostPopular;
    }
}

const handleReq = (req, res) => {
    res.status(200);
    renderData(req.params.id);
    res.render(`pages/${req.params.id}`, {
        title: title,
        data: data
    });
}

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here
app.get('/:id', handleReq);

// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
})

.listen(PORT, () => console.log(`Listening on port ${PORT}`));
