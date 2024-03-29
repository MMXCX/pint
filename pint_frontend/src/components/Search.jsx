import { useState, useEffect } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'


const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchQuery(searchTerm.toLowerCase())
      setLoading(true)

      client.fetch(query)
          .then((data) => {
            if (searchTerm) {
              const query = searchQuery(searchTerm)

              client.fetch(query)
                  .then((data) => {
                    setPins(data)
                    setLoading(false)
                  })
            } else {
              client.fetch(feedQuery)
                  .then((data) => {
                    setPins(data)
                    setLoading(false)
                  })
            }
          })
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
      <div>
        {loading && <Spinner message="Searching for pins..."/>}
        {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
        {pins?.length === 0 && searchTerm !== '' && !loading &&
            <div className="mt-10 text-center text-xl">No Pins Found!</div>
        }
      </div>
  )
}

export default Search
