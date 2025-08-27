import React, { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import { Spinner } from 'flowbite-react'
import { useDebounce } from 'react-use'
import Moviecard from './components/Moviecard'
import { getTrendingMovies, updateSearchCount } from '../appwrite'
import DotGrid from './components/DotGrid/DotGrid'
import LightRays from './components/LightRays/LightRays'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false)
  const [trendingMovieLoading, setTrendingMovieLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm])

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setMovieList([])

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      if (!data.results || data.results.length === 0) {
        setErrorMessage('No movies found.')
        return
      }
      setMovieList(data.results)
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0])
      }
      console.log(data)
    } catch (error) {
      setErrorMessage(`Failed to fetch movies. Please try again later. ${error.message}`)
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    setTrendingMovieLoading(true)
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error('Error loading trending movies:', error)
    } finally {
      setTrendingMovieLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  return (
    <main>
      <div style={{

        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {/* <DotGrid
          dotSize={8}
          gap={19}
          baseColor="#5227FF"
          activeColor="#f8f9fa"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        /> */}
        <LightRays
          raysOrigin="top-center"
          raysColor='#FFFFFF'
          // "#f8f9fa"
          // "#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays" />
      </div>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt="hero banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> you Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovieLoading ? (
          <Spinner color="purple" aria-label="loading" size="xl" />
        ) : errorMessage ? (
          <p className='text-red-700'>{errorMessage}</p>
        ) : (
          trendingMovies.length > 0 && (
            <section className='trending'>
              <h2 className=''>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        <section className='all-movies'>
          <h2 className=''>All Movies</h2>
          {loading ? (
            <Spinner color="purple" aria-label="loading" size="xl" />
          ) : errorMessage ? (
            <p className='text-red-700'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map(movie => (
                <Moviecard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
