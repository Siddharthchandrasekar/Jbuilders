import React from "react"
import { footer } from "../../data/Data"
import "./footer.css"

const Footer = () => {
  return (
    <>
      <section className='footerContact'>
        <div className='container'>
          <div className='send flex'>
            <div className='text'>
              <h1>Do You Have Questions ?</h1>
              <p>We'll help you to grow your career and growth.</p>
            </div>
            <button className='btn5'>Contact Us Today</button>
          </div>
        </div>
      </section>

      <footer>
        <div className='container'>
          {footer.map((val) => (
            <div className='box'>
              <ul>
                {val.text.map((items) => (
                  <li> {items.list} </li>
                ))}
              </ul>
              <i class='fa-brands fa-facebook-f'></i> <i class='fa-brands fa-linkedin'></i> <i class='fa-brands fa-twitter'></i> <i class='fa-brands fa-instagram'></i>
            </div>
          ))}
        </div>
      </footer>
      <div className='legal'>
        <span>© 2023 J Builders.</span>
      </div>
    </>
  )
}

export default Footer
