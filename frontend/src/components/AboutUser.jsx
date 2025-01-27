import React from 'react'
import GetDay from './GetDay'

const AboutUser = ({bio, joinedAt, className}) => {
  return (
    <div className={'md:w-[90%] md:mt-7 ' + className}>
      <p>{bio.length ? bio : "Nothing to read here"}</p>
      {/* <div className='flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-zinc-400'>

      </div> */}
      <p className='text-xl leading-7 text-zinc-400'>Joined on {GetDay(joinedAt)}</p>
    </div>
  )
}

export default AboutUser
