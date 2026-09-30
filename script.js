document.addEventListener('DOMContentLoaded', () => {
  const envJourney = document.querySelector('.environmental-journey');
  const envSky = document.querySelector('.env-sky');
  
  if (!envJourney) return;

  const pubSection = document.querySelector('.pub-section'); 
  const hobbiesSection = document.querySelector('.hobbies-section'); 
  const aboutSection = document.querySelector('.about-section'); 
  const expSection = document.querySelector('#experience'); 

  function updateScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollP = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    
    envJourney.style.setProperty('--scroll-p', scrollP);

    let skyColor = '#a8c8d8';
    if (scrollP > 0.2 && scrollP <= 0.4) {
      skyColor = '#faf6ef';
    } else if (scrollP > 0.4 && scrollP <= 0.6) {
      skyColor = '#f2e8d5';
    } else if (scrollP > 0.6) {
      skyColor = '#c8e8d5';
    }
    envSky.style.backgroundColor = skyColor;

    let sunP = 0;
    if (pubSection && hobbiesSection) {
      const pubTop = pubSection.offsetTop;
      const hobbiesBottom = hobbiesSection.offsetTop + hobbiesSection.offsetHeight;
      if (scrollY + window.innerHeight > pubTop && scrollY < hobbiesBottom) {
        const sunRange = hobbiesBottom - pubTop;
        const sunScroll = (scrollY + window.innerHeight) - pubTop;
        const rawSunP = Math.min(Math.max(sunScroll / sunRange, 0), 1);
        sunP = Math.sin(rawSunP * Math.PI); 
      }
    }
    envJourney.style.setProperty('--sun-p', sunP);

    let groundP = 0;
    if (aboutSection) {
      const aboutTop = aboutSection.offsetTop;
      const startGround = aboutTop - window.innerHeight;
      if (scrollY > startGround) {
        groundP = Math.min(Math.max((scrollY - startGround) / window.innerHeight, 0), 1);
      }
    }
    envJourney.style.setProperty('--ground-p', groundP);

    let greeneryP = 0;
    if (expSection) {
      const expTop = expSection.offsetTop;
      const startGreen = expTop - window.innerHeight / 2;
      if (scrollY > startGreen) {
        greeneryP = Math.min(Math.max((scrollY - startGreen) / (expSection.offsetHeight), 0), 1);
      }
    }
    envJourney.style.setProperty('--greenery-p', greeneryP);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateScroll();
});
