const fs = require('fs');
const ytdl = require('ytdl-core')

let youTubeUrl
let videoFormats

export const getYoutubeInfo = async (url) => {
    youTubeUrl = url
    // console.log('url :', url)
    let info = await ytdl.getInfo(url)
    videoFormats = info.formats
    var uinfo = []
    videoFormats.map((res) => {
        // console.log('res: ', res)
        const result = {
            itag: res.itag,
            container: res.container,
            quality: res.quality,
            codecs: res.codecs,
            bitrate: res.bitrate
        }
        if (
            res.hasAudio === true
            && res.container === 'mp4'
            && res.hasVideo === true
        ) {
            uinfo.push(result)
        }
    })
    return uinfo
}

export const downloadYoutubeMp4 = async (quality, videoQuality, currentSystemDownloadPath) => {
    // console.log('downloadYoutubeMp4: ', youTubeUrl, quality, videoQuality)
    // mp4
    return new Promise((resolve, reject) => {
        const format = ytdl.chooseFormat(videoFormats, { quality: quality })
        const videoSteam = ytdl(youTubeUrl, { format: format })
        // videoSteam.on('progress', (chunkLength, downloaded, total) => {
        //     const progress = (downloaded / total) * 100;
        //     // console.log(`Downloading video: ${progress.toFixed(2)}%`)
        // })
        videoSteam.pipe(fs.createWriteStream(`${currentSystemDownloadPath}${Date.now()}-video-${videoQuality}.mp4`))
        videoSteam.on('finish', () => {
            console.log('finish!!!!!')
            resolve(true)
        })
    })
}

export const downloadYoutubeMp3 = (currentSystemDownloadPath, url) => {
    console.log('downloadYoutubeMp3: ', url)

    // mp3
    return new Promise((resolve, reject) => {
        const videoSteam = ytdl(url, { filter: 'audio' })

        videoSteam.pipe(fs.createWriteStream(`${currentSystemDownloadPath}${Date.now()}-video.m4a`))

        videoSteam.on('finish', () => {
            console.log('finish!!!!!')
            resolve(true)
        })
    })


}