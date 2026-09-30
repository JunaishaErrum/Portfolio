import os

css_content = """
/* ENVIRONMENTAL JOURNEY SCROLL ANIMATION */
.environmental-journey {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  --scroll-p: 0;
  --sun-p: 0;
  --ground-p: 0;
  --greenery-p: 0;
}

.env-layer {
  position: absolute;
  inset: 0;
  will-change: transform, opacity, background-color;
}

/* 1. Sky Color */
.env-sky {
  /* Sky transitions from blue -> cream -> yellow -> blue */
  background: var(--cream);
  transition: background-color 0.1s linear;
}

/* 2. Parallax Clouds */
.env-clouds-bg {
  transform: translateY(calc(var(--scroll-p) * -30vh));
}
.env-clouds-mid {
  transform: translateY(calc(var(--scroll-p) * -50vh));
}
.env-clouds-fg {
  transform: translateY(calc(var(--scroll-p) * -80vh));
}

/* 3. Sun */
.env-sun {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(calc(100vh - (var(--sun-p) * 150vh)));
  opacity: calc(var(--sun-p) * 2);
}
.the-sun {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff9c4 30%, #fdd835 60%, #f9a825 100%);
  box-shadow: 0 0 60px 30px rgba(253, 216, 53, .4), 0 0 100px 50px rgba(249, 168, 37, .2);
}

/* 4. Ground Descent */
.env-ground {
  transform: translateY(calc(100vh - (var(--ground-p) * 100vh)));
  background: linear-gradient(180deg, transparent 0%, var(--cream) 10%, #e2edd8 30%, #c8e8d5 100%);
}

.grass-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background-size: cover;
  opacity: var(--greenery-p);
}

/* 5. Ants Interaction */
.ant {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
  animation: antWander 15s infinite alternate ease-in-out;
}
.ant-1 { bottom: 10vh; left: 20vw; }
.ant-2 { bottom: 15vh; right: 25vw; animation-delay: -5s; }
.ant-3 { bottom: 8vh; left: 60vw; animation-delay: -10s; }

.ant:hover {
  transform: scale(1.2) rotate(15deg) translateX(10px);
}

@keyframes antWander {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -5px) rotate(10deg); }
  50% { transform: translate(40px, 10px) rotate(-5deg); }
  75% { transform: translate(15px, 20px) rotate(-15deg); }
  100% { transform: translate(-10px, 5px) rotate(5deg); }
}

/* Make content sections transparent so the background shows */
body {
  background: transparent !important;
}
.sky-background-wrapper, .hero, .projects-section, .pub-section, .hobbies-section, .about-section, .expertise-section {
  background: transparent !important;
}

@media (prefers-reduced-motion: reduce) {
  .environmental-journey {
    display: none;
  }
  body {
    background: var(--cream) !important;
  }
}
"""

with open('style.css', 'a') as f:
    f.write(css_content)

print("Appended CSS successfully.")
