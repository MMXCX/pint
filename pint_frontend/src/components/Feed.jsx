import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import search from "./Search";
import { searchQuery, feedQuery } from '../utils/data'

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    if (categoryId) {
      const query = searchQuery(categoryId)
      client.fetch(query)
          .then(data => {
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
  }, [categoryId])

  if (loading) return <Spinner message="We are adding new ideas to you feed!"/>
  return (
      <div>
        {pins?.length > 0 ? <MasonryLayout pins={pins}/> : <h2>No pins available.</h2>}
      </div>
  )
}

export default Feed
