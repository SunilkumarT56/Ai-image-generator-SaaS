import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const {user,setShowLogin}=useContext(AppContext)
  const navigate=useNavigate()

  const oncClickHandler=()=>{
    if(user){
      navigate('/result')
    }else{
      setShowLogin(true)
    }
  }


  return (
    <motion.div className='flex flex-col items-center justify-center
    text-center mt-30 mb-50 gap-2'
    initial={{opacity:0.2, y: 100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    >
      <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1
      rounded-full border border-neutral-500'
      initial={{opacity:0, y: -20}}
      animate={{opacity:1, y:0}}
      transition={{delay:0.2, duration:0.8}}
      >
        <p>Best Text To Image Generator</p>
        <img src={assets.star_icon} alt="" />
      </motion.div>

      <motion.h1
      initial={{opacity:0}} 
      animate={{opacity:1}}
      transition={{delay:0.4, duration:2}}
      className='text-4l max-w-[300px] sm:text-7xl sm:max-w-[590px]
      mx-auto mt-10 text-center'>Turn text to <span className='text-blue-600'>image</span>, in seconds.</motion.h1>

      <motion.p 
      initial={{opacity:0,y:20}} 
      animate={{opacity:1,y:0}}
      transition={{delay:0.6, duration:0.8}}
      className='text-center max-w-xl mx-auto mt-5'>Unleash your creativity with our AI image generator-Just type and watch the magic happen.</motion.p>

      <motion.button 
      onClick={oncClickHandler}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{default: {duration:0.5},opacity:{delay:0.8,duration:1}}}
      className='sm:text-lg text-white bg-black w-auto mt-8
      px-12 py-2.5 flex items-center gap-2 rounded-full'>
        Generate Images
        <img className='h-6' src={assets.star_group} alt="" /></motion.button>


        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:1,duration:1}}
        className='flex justify-center gap-3
        mt-10 flex-wrap'>
            {Array(6).fill('').map((item,index)=>(
                <motion.img 
                whileHover={{scale:1.05,duration:0.1}}
                className='rounded hover:scale-105 transition-all 
                duration-300 cursor-pointer max-sm:w-10'
                src={index%2==0 ? assets.sample_img_2 : assets.sample_img_1} 
                alt="" key={index} width={70} />
            ))}
        </motion.div>

        <motion.p 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:1.2,duration:0.8}}
        className='mt-2 text-neutral-600'>Generated image from imagify</motion.p>
    </motion.div>
  )
}

export default Header
