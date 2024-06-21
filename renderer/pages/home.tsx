import React from 'react'
import Head from 'next/head'
import { Button, Link as ChakraLink } from '@chakra-ui/react'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import Youtube from '../components/Youtube'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>SQN-YTD</title>
      </Head>
      <Container minHeight="100vh">

        <Youtube />
        <DarkModeSwitch />
        <Footer>
          <p>Copyright © {new Date().getFullYear()} <ChakraLink href="https://github.com/srib1997" target={'_blank'}>Srib</ChakraLink> <ChakraLink href="https://github.com/quinton0121" target={'_blank'}>Quinton</ChakraLink></p>
        </Footer>
      </Container>
    </React.Fragment>
  )
}
