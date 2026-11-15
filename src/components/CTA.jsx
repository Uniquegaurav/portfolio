import { Link } from "react-router-dom";
import { cta } from "../constants";

const CTA = () => {
  const [first, ...rest] = cta.text.split("\n");
  return (
    <section className='cta'>
      <p className='cta-text'>
        {first} <br className='sm:block hidden' />
        <span className='teal-text-gradient'>{rest.join(" ")}</span>
      </p>
      <Link to='/contact' className='btn'>
        {cta.button}
      </Link>
    </section>
  );
};

export default CTA;
