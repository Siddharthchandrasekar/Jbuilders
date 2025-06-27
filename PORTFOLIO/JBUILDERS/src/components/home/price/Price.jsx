import React from "react"
import Heading from "../../common/Heading"
import "./price.css"
import PriceCard from "./PriceCard"

const Price = () => {
  return (
    <>
      <section className='price padding'>
        <div className='container'>
          <Heading title='Get Quote From Us' subtitle='Get a detailed proposal tailored to your project requirements.' />
          <PriceCard />
        </div>
      </section>
    </>
  )
}

export default Price
