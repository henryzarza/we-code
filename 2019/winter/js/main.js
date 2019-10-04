const imageContainer = document.querySelectorAll('.section__item-img');

Array.from(imageContainer).forEach(el => {
  const imgs = Array.from(el.querySelectorAll('img'));
  new hoverEffect({
    parent: el,
    intensity1: 0.2,
    // intensity2: 0.15,
    angle2: Math.PI,
    easing: 'Circ.easeOut',
    speedOut: 0.6,
    speedIn: 0.6,
    image1: imgs[0].getAttribute('src'),
    image2: imgs[1].getAttribute('src'),
    displacementImage: el.dataset.displacement
  });
});

/* onePageScroll("#fullpage", {
  sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
  // easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
  // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
  animationTime: 500,             // AnimationTime let you define how long each section takes to animate
  pagination: false,                // You can either show or hide the pagination. Toggle true for show, false for hide.
  loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
  keyboard: true,                  // You can activate the keyboard controls
}); */
