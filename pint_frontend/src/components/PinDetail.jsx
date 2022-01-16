import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdDownloadForOffline } from 'react-icons/md'
import { v4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout';

import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
import { data } from "autoprefixer";
import pin from "./Pin";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinsDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)

  const { pinId } = useParams()

  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query)
          .then((data) => {
            setPinDetail(data[0])

            if (data[0]) {
              query = pinDetailMorePinQuery(data[0])

              client.fetch(query)
                  .then((res) => {
                    setPins(res)
                  })
            }
          })
    }
  }

  const addComment = () => {
    if (comment) {

      setAddingComment(true)

      client.patch(pinId)
          .setIfMissing({ comments: [] })
          .insert('after', 'comments[-1]', [{
            comment,
            _key: v4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id
            }
          }])
          .commit()
          .then(() => {
            fetchPinDetail()
            setComment('')
            setAddingComment(false)
            // window.location.reload()
          })
    }
  }

  useEffect(() => {
    fetchPinDetail()
  }, [pinId])

  if (!pinsDetail) return <Spinner message="Loading pin..."/>
  return (
      <>
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: 1500, borderRadius: 32 }}>
          <div className="justify-center items-center md:items-start flex-initial">
            <img
                src={pinsDetail?.image && urlFor(pinsDetail.image).url()}
                className="rounded-t-3xl rounded-b-lg"
                alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:max-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                    href={`${pinsDetail?.image.asset.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white h-9 w-9 rounded-full flex items-center justify-center text-center text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline/>
                </a>
              </div>
              <a href={pinsDetail?.destination} target="_blank" rel="noreferrer">
                {pinsDetail?.destination}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinsDetail.title}
              </h1>
              <p className="mt-3">
                {pinsDetail.about}
              </p>
            </div>
            <Link
                to={`/user-profile/${pinsDetail?.postedBy?._id}`}
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={pinsDetail?.postedBy?.image}
                  alt="user-profile"
              />
              <p className="font-semibold capitalize">{pinsDetail?.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinsDetail?.comments?.map(({ comment, postedBy, _key }) =>
                  <div
                      className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                      key={_key}
                  >
                    <img
                        src={postedBy.image}
                        className="w-10 h-10 rounded-full cursor-pointer"
                        alt="user-profile"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">{postedBy.userName}</p>
                      <p>
                        {comment}
                      </p>
                    </div>
                  </div>
              )}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link
                  to={`/user-profile/${pinsDetail?.postedBy?._id}`}
              >
                <img
                    className="h-10 w-10 rounded-full cursor-pointer"
                    src={pinsDetail?.postedBy?.image}
                    alt="user-profile"
                />
              </Link>
              <input
                  className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
              />
              <button
                  type="button"
                  className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                  onClick={addComment}
              >
                {addingComment ? 'Posting the comment...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        {pins ?
            <>
              {pins.length > 0 &&
                  <>
                    <p className="text-center font-bold text-2xl mt-8 mb-4">
                      More like this
                    </p>
                    <MasonryLayout pins={pins}/>
                  </>
              }
            </>
            :
            <Spinner message="Loading more pins..."/>
        }
      </>
  )
}

export default PinDetail
