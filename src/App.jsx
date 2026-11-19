import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight, Camera, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, MapPin, MoveRight, Moon, RefreshCw, Sun, Trees } from 'lucide-react';

const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=44.6488&longitude=-63.5752&current=temperature_2m,apparent_temperature,weather_code,is_day&temperature_unit=celsius&timezone=auto';
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

function describeWeather(code) {
  if (code === 0) return 'Clear skies';
  if (code <= 3) return ['Clear', 'Mainly clear', 'Partly cloudy', 'Overcast'][code];
  if (code === 45 || code === 48) return 'Fog';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorms';
  return 'Cloudy';
}

function getWeatherIcon(code, isDay) {
  if (code === 0) return isDay ? Sun : Moon;
  if (code <= 3) return CloudSun;
  if (code === 45 || code === 48) return CloudFog;
  if (code <= 57) return CloudDrizzle;
  if (code <= 67 || code <= 82) return CloudRain;
  if (code <= 86) return CloudSnow;
  if (code >= 95) return CloudLightning;
  return Cloud;
}

function getWeatherArt(temperatureC) {
  if (temperatureC <= 10) return { src: assetUrl('weather/cold.png'), alt: 'Blue cloud with falling snowflakes' };
  if (temperatureC < 20) return { src: assetUrl('weather/mild.png'), alt: 'Sun partly covered by a blue cloud' };
  return { src: assetUrl('weather/sunny.png'), alt: 'Bright yellow sun' };
}

const places = [
  {
    number: '01',
    name: 'Halifax Waterfront',
    kind: 'HARBOUR · DOWNTOWN HALIFAX',
    detail: 'A lively boardwalk along the harbour, with public art, local shops, and wide-open waterfront views.',
    icon: <Camera size={18} strokeWidth={1.7} />,
  },
  {
    number: '02',
    name: 'Halifax Citadel',
    kind: 'HISTORY · CITADEL HILL',
    detail: 'A star-shaped National Historic Site overlooking downtown and the harbour, with a window into Halifax’s history.',
    icon: <Trees size={18} strokeWidth={1.7} />,
  },
];

function App() {
  const [view, setView] = useState('about');
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('loading');
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const isAbout = view === 'about';

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setWeatherStatus('loading');
      try {
        const response = await fetch(weatherUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const payload = await response.json();
        const current = payload.current;
        if (!current || !Number.isFinite(current.temperature_2m)) {
          throw new Error('Weather response did not include a temperature.');
        }
        setWeather({
          temperatureC: current.temperature_2m,
          apparentTemperatureC: current.apparent_temperature,
          code: current.weather_code,
          isDay: current.is_day === 1,
        });
        setWeatherStatus('ready');
      } catch (error) {
        if (error.name === 'AbortError') return;
        setWeatherStatus('error');
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [refreshCount]);

  const weatherArt = weather ? getWeatherArt(weather.temperatureC) : null;
  const WeatherIcon = weather ? getWeatherIcon(weather.code, weather.isDay) : CloudSun;
  const displayTemperature = weather
    ? (isFahrenheit ? (weather.temperatureC * 9) / 5 + 32 : weather.temperatureC).toFixed(1)
    : null;
  const displayFeelsLike = weather
    ? (isFahrenheit ? (weather.apparentTemperatureC * 9) / 5 + 32 : weather.apparentTemperatureC).toFixed(1)
    : null;
  const weatherAdvice = weather && (weather.temperatureC <= 10
    ? "It's cold outside. Stay warm!"
    : weather.temperatureC < 20
      ? 'The weather is mild today!'
      : "It's a warm day in Halifax!");

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Khushi Trivedi home" onClick={() => setView('about')}>
          <span className="wordmark-stamp">KT</span>
          <span className="wordmark-name">KHUSHI TRIVEDI<span>PERSONAL FIELD NOTES</span></span>
        </a>
        <nav className="view-switch" aria-label="Choose a view">
          <button className={isAbout ? 'active' : ''} onClick={() => setView('about')} aria-current={isAbout ? 'page' : undefined}>About me</button>
          <button className={!isAbout ? 'active' : ''} onClick={() => setView('town')} aria-current={!isAbout ? 'page' : undefined}>My town</button>
        </nav>
        <div className="location-mark"><MapPin size={15} /> HALIFAX, NS</div>
      </header>

      {isAbout ? (
        <section className="view about-view" id="top" aria-labelledby="page-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> NICE TO MEET YOU! <span className="eyebrow-count">01 / 02</span></div>
              <h1 id="page-title">Hello, I'm<br /><em>Khushi Trivedi!</em></h1>
              <p className="hero-lede">I'm a postgraduate student at Saint Mary's University, studying Computing and Data Analytics. I enjoy learning about technology, exploring new ideas, and developing my skills in programming and data analytics.</p>
              <button className="text-link" onClick={() => setView('town')}>Explore My Town <MoveRight size={17} /></button>
              <span className="hero-doodle" aria-hidden="true">✳</span>
            </div>
            <figure className="portrait-frame">
              <img src={assetUrl('weather/image.png')} alt="Khushi Trivedi smiling outdoors" />
              <figcaption><span>01</span> A GOOD DAY STARTS WITH A LONG WALK.</figcaption>
            </figure>
          </div>

          <div className="about-strip">
            <div className="about-label"><span className="section-index">01—</span><span>A LITTLE<br />ABOUT ME</span></div>
            <div className="about-bio">
              <h2>A Little About Me</h2>
              <div className="about-list">
                <p>📚 I enjoy learning and discovering new ideas.</p>
                <p>💻 I'm interested in technology and programming.</p>
                <p>🌱 I believe in continuous learning and personal growth.</p>
                <p>✨ My goal is to build a successful career in technology.</p>
              </div>
            </div>
          </div>

          <div className="bottom-note"><span>MADE OF SMALL MOMENTS</span><span>SCROLL TO EXPLORE <ArrowDownRight size={15} /></span><span>44°39′N 63°34′W</span></div>
        </section>
      ) : (
        <section className="view town-view" id="top" aria-labelledby="page-title">
          <div className="eyebrow town-kicker"><span className="eyebrow-line" /> MY HOME TOWN IN <span className="eyebrow-count">02 / 02</span></div>
          <figure className="town-photo">
            <img src={assetUrl('images/halifax-harbour.svg')} alt="Illustration of Halifax Harbour, its skyline, and a ferry" />
            <figcaption><span><MapPin size={14} /> HALIFAX, NOVA SCOTIA</span><span>44°39′N&nbsp;&nbsp; 63°34′W</span></figcaption>
          </figure>

          <div className="town-heading">
            <div>
              <h1 id="page-title">Welcome to <em>Halifax!</em></h1>
            </div>
            <div className="town-intro">
              <p>Halifax is a welcoming coastal city on the Atlantic Ocean, known for its working harbour, maritime history, and lively arts and food scene.</p>
            </div>
          </div>

          <aside className="weather-feature" aria-label="Current weather in Halifax" aria-live="polite">
            {weatherArt ? (
              <img className="weather-art" src={weatherArt.src} alt={weatherArt.alt} />
            ) : (
              <div className="weather-art-placeholder"><WeatherIcon size={36} /></div>
            )}
            <div className="weather-reading">
              <a className="weather-attribution" href="https://open-meteo.com/" target="_blank" rel="noreferrer">CURRENT WEATHER IN HALIFAX · OPEN-METEO</a>
              {weather ? (
                <>
                  <h2 className="weather-title">Current Weather in Halifax</h2>
                  <strong>{displayTemperature}°{isFahrenheit ? 'F' : 'C'}</strong>
                  <span>{describeWeather(weather.code)} · feels like {displayFeelsLike}°{isFahrenheit ? 'F' : 'C'}</span>
                  <span className="weather-advice">{weatherAdvice}</span>
                </>
              ) : (
                <span role="status">{weatherStatus === 'loading' ? 'Loading current weather…' : 'Weather is unavailable right now.'}</span>
              )}
            </div>
            <div className="weather-actions">
              <button className="unit-toggle" onClick={() => setIsFahrenheit((value) => !value)}>
                Change to °{isFahrenheit ? 'C' : 'F'}
              </button>
              {weatherStatus === 'error' && (
                <button className="weather-retry" onClick={() => setRefreshCount((count) => count + 1)} aria-label="Retry weather request">
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          </aside>

          <div className="places-heading"><div className="about-label"><span className="section-index">02—</span><span>MY LITTLE<br />CITY GUIDE</span></div><p>Two places to explore.</p><span className="place-count">TWO FAVORITES <ArrowUpRight size={15} /></span></div>
          <div className="place-list">
            {places.map((place) => (
              <article className="place-row" key={place.number}>
                <span className="place-number">{place.number}</span>
                <div className="place-title"><h2>{place.name}</h2><span>{place.kind}</span></div>
                <p>{place.detail}</p>
                <span className="place-icon">{place.icon}</span>
              </article>
            ))}
          </div>
          <button className="text-link town-back" onClick={() => setView('about')}><ArrowDownLeft size={16} /> Back to About Me</button>
          <div className="bottom-note"><span>MADE OF SMALL MOMENTS</span><span>MORE SOON <ArrowDownRight size={15} /></span><span>NOVA SCOTIA, CANADA</span></div>
        </section>
      )}
    </main>
  );
}

export default App;
