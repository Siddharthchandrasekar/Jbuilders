import React from "react"
import Heading from "../../common/Heading"
import "./hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <Heading title='We Build Your Dreams!' subtitle='Inspire. Plan. Reality.' />
        </div>
      </section>
    </>
  )
}

export default Hero
