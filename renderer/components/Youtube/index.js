import React from 'react'
import ReactPlayer from 'react-player/youtube'
import {
    Button,
    Center,
    Flex,
    Input,
    Text,
    Box, Card, CardHeader, CardBody, CardFooter, Stack, Heading
} from '@chakra-ui/react'
import Swal from 'sweetalert2'

const isClient = typeof window !== 'undefined';
const ipc = isClient ? window.ipc : null;
const isProd = process.env.NODE_ENV === 'production'

function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
        // return url.match(p)[1]
        return true
    }
    return false
}

export default function index() {
    const [youtubeUrl, setYoutubeUrl] = React.useState('')
    const [youtubeUrlSuccess, setYoutubeUrlSuccess] = React.useState('')
    const [youtubeInfo, setYoutubeInfo] = React.useState([])

    const handleYoutubeLink = (event) => {
        setYoutubeUrl(event.target.value)
    }

    const getYoutubeInfo = () => {
        if (youtubeUrl === '' || !matchYoutubeUrl(youtubeUrl)) {
            return Swal.fire(

                '查找失敗!',
                '請檢查你的連結!',
                'error'
            )
        }
        try {
            ipc.invoke('get-youtube-info', { url: youtubeUrl }).then((result) => {
                console.log('get-youtube-info-fondend: ', result)
                setYoutubeUrlSuccess(youtubeUrl)
                setYoutubeInfo(result)
            })
        }
        catch (e) { console.log('Failed get-youtube-info !') }
    }

    const downloadYoutubeMp4 = (quality, videoQuality) => {
        try {
            ipc.invoke('download-youtube-mp4', { quality, videoQuality }).then((response) => {
                console.log('download-youtube-mp4: ', response)
                if (response) {
                    Swal.fire(
                        '下載完成!',
                        '請在下載位置檢查檔案!',
                        'success'
                    )
                } else {
                    Swal.fire(
                        '下載失敗!',
                        '請檢查你的連結或連結!',
                        'error'
                    )
                }
            })
            loadingAlert()
        }
        catch (e) { console.log('Failed download-youtube-mp4 !') }
    }

    const downloadYoutubeMp3 = () => {
        if (youtubeUrl === '' || !matchYoutubeUrl(youtubeUrl)) {
            return Swal.fire(
                '查找失敗!',
                '請檢查你的連結!',
                'error'
            )
        }
        try {
            ipc.invoke('download-youtube-mp3', { url: youtubeUrl }).then((response) => {
                console.log('download-youtube-mp3: ', response)
                if (response) {
                    Swal.fire(
                        '下載完成!',
                        '請在下載位置檢查檔案!',
                        'success'
                    )
                } else {
                    Swal.fire(
                        '下載失敗!',
                        '請檢查你的連結或連結!',
                        'error'
                    )
                }
            })
            loadingAlert()
        }
        catch (e) { console.log('Failed download-youtube-mp3 !') }
    }

    const loadingAlert = () => {
        // let timerInterval
        Swal.fire({
            title: '下載中!',
            html: '請稍等片刻!',
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                // clearInterval(timerInterval)
                loadingAlert()
            }
        })
    }

    React.useEffect(() => {

        return () => {
            ipc.removeAll('')
        };
    }, [])

    return (
        <>
            <Flex w={'80%'} mt={2}>
                <Center w={"100%"}>
                    <Input placeholder='連結' onChange={handleYoutubeLink} margin={2} />
                    <Button onClick={() => getYoutubeInfo()}>影片下載</Button>
                    <Button onClick={() => downloadYoutubeMp3()} margin={2}>音源下載</Button>
                </Center>


            </Flex>
            <Flex>
                <Center w={'100%'}>
                    {
                        youtubeUrlSuccess.length > 0
                            ?
                            <ReactPlayer url={youtubeUrlSuccess} />
                            : <></>
                    }
                </Center>
            </Flex>
            <Flex m={2}>
                <Center w={'100%'}>
                    {
                        youtubeInfo.map((res, index) => (
                            <Card
                                direction={{ base: 'column', sm: 'row' }}
                                overflow='hidden'
                                variant='outline'
                                key={'youtubeInfo' + index}
                                m={1}
                            >

                                <Stack>
                                    <CardBody>
                                        <Heading size='md'>{res.quality}</Heading>

                                        <Text py='2'>
                                            格式： {res.container}
                                        </Text>
                                        <Text py='2'>
                                            編解碼器： {res.codecs}
                                        </Text>
                                        <Text py='2'>
                                            比特率： {res.bitrate}
                                        </Text>
                                    </CardBody>

                                    <CardFooter>
                                        <Button variant='solid' colorScheme='blue' onClick={() => downloadYoutubeMp4(res.itag, (res.quality + '-' + res.codecs))}>
                                            下載
                                        </Button>
                                    </CardFooter>
                                </Stack>
                            </Card>
                        ))
                    }
                </Center>

            </Flex>
        </>
    )
}
