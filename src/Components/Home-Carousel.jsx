import '../Styles/Home.css';
import Carousel from 'react-bootstrap/Carousel';
import facadev2 from '../assets/facadev2.jpg';
import dronev2 from '../assets/dronev2.jpg';
import firevs from '../assets/firevs.jpg';

function HomeCarousel() {
  return (
    <Carousel className="slide">
      <Carousel.Item>
        <img
          src={facadev2}
          alt="First slide"
        />
        <Carousel.Caption>
        <h3>PLM Facade</h3>
          <p>An inviting gateway to karunungan, kaunlaran, kadakilaan</p>
        </Carousel.Caption>

      </Carousel.Item >
      <Carousel.Item>
        <img
          src={firevs}
          alt="Second slide"
        />

        <Carousel.Caption>
        <h3>Eternal Torch and the Flame of Excellence</h3>
          <p>The Iconic Sibuyas</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          src={dronev2}
          alt="Third slide"
        />

        <Carousel.Caption>
        <h3>PLM Aerial View</h3>
          <p>
          Where students are encourage to explore their passions and expand their horizons
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeCarousel;