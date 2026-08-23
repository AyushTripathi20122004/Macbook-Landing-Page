import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Lenis from 'lenis';

const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


// gaming video animation here

gsap.fromTo(
  '.gaming-Video-Herotext',
  {
    scale: 52,
  },
  {
    scale: 1,
    ease: "power1",
    scrollTrigger: {
      trigger: '.gamingperfomace',
      start: "top top",
      end: "+=1500",
      scrub: true,
      pin: true,
      markers: false, // remove after testing
    },
  }
);

// graphics performance gsap animation here

const graphicsTl = gsap.timeline({

  scrollTrigger: {
    trigger: '.graphics-performance-text',
    start: "top top",
    end: "+=1000",
    scrub: 1.5,
    pin: true,
    markers: false,
  },

});

graphicsTl
  .to('.lw-img1', {
    x: -180,
    y: -40,
  }, 'start')

  .to('.lw-img2', {
    x: -190,
    y: 20,
  }, 'start')

  .to('.lw-img3', {
    x: -200,
    y: 40,
  }, 'start')

  .to('.rw-img1', {
    x: 180,
    y: -40,
  }, 'start')

  .to('.rw-img2', {
    x: 190,
    y: 20,
  }, 'start')

  .to('.rw-img3', {
    x: 200,
    y: 40,
  }, 'start')

  .to('.graphics-performance-text', {
    autoAlpha: 0,
    duration: 0.02
  }, 'start')

  .from('.graphics-perfomance-text2', {
    opacity: 0,
  }, 'start')

