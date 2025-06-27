import React from "react"
import Back from "../common/Back"
import Heading from "../common/Heading"
import img from "../images/about.jpg"
import "./about.css"

const About = () => {
  return (
    <>
      <section className='about'>
        <Back name='About Us' title='About Us - Who/What/Where We Are?' cover={img} />
        <div className='container flex mtop'>
          <div className='left row'>
            <Heading title='Our Story' subtitle='Check out our company story and work process' />

            <p>"JBuilders: Crafting Dreams, Building Legacies

In the heart of the city, JBuilders is more than a construction company; it's a story of passion, excellence, and community. With a commitment to quality craftsmanship, innovation, and sustainability, they transform dreams into reality. From humble beginnings to towering achievements, JBuilders stands tall as a beacon of integrity and inspiration in the construction industry."</p>
          </div>
          <div className='right row'>
            <img src='./immio.jpg' alt='' />
          </div>
        </div>
      </section>
    </>
  )
}

export default About
