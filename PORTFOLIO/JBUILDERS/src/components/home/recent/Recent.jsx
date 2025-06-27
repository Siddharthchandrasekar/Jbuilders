import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Recent Property Listed' subtitle='Welcome to the epitome of contemporary living! We are thrilled to present our latest property listing — a stunning new construction that seamlessly blends modern design with functionality. This exquisite residence is situated in the heart of [City/Area], offering convenience and style for those seeking a sophisticated urban lifestyle.' />
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
