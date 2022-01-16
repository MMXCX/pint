import { Circles } from 'react-loader-spinner'

const Spinner = ({ message }) => {
  return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Circles
            arialLabel="loading-indicator"
            color="#00BFFF"
            height={50}
            width={200}
            wrapperClass="m-5"
        />
        <p className="text-lg text-center px-2">{message}</p>
      </div>
  )
}

export default Spinner
