const imageContainer = document.querySelectorAll('.section__item-img');

Array.from(imageContainer).forEach(el => {
  const imgs = Array.from(el.querySelectorAll('img'));
  new hoverEffect({
    parent: el,
    intensity1: 0.2,
    angle2: Math.PI,
    easing: 'Circ.easeOut',
    speedOut: 0.6,
    speedIn: 0.6,
    image1: imgs[0].getAttribute('src'),
    image2: imgs[1].getAttribute('src'),
    displacementImage: el.dataset.displacement
  });
});
