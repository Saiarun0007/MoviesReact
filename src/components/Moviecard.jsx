import React from 'react'

const Moviecard = ({ movie: { title, poster_path, release_date, original_language, vote_average } }) => {
    return (
        <div className='movie-card'>
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : './no-movie.png'} alt={title} />
            <div className='mt-4'>
                <h3 className=''>{title}</h3>
                <div className='content'>
                    <div className='rating '>
                        <img src="./star.svg" alt="star rating" />
                        <p className='text-gray-200'>{vote_average ? vote_average : `realiste data:${release_date}`}</p>
                        <span>.</span>
                        <p className='lang'>{original_language}</p>
                        <span>.</span>
                        <p className='year'>{release_date}</p>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Moviecard