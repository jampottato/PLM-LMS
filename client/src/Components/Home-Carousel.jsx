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
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>

      </Carousel.Item >
      <Carousel.Item>
        <img
          src={firevs}
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          src={dronev2}
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeCarousel;