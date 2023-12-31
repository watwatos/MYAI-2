'use client'

import React, { useContext, useEffect, useState } from 'react'
import {AiFillCaretRight} from 'react-icons/ai'
import { FaCrown } from "react-icons/fa";
import Profile from './Profile'
import Link from 'next/link'
import { motion as m } from 'framer-motion'
import { usePathname } from 'next/navigation'

import {tools} from '../../../utils/arrays';
import { useSession } from 'next-auth/react'
import { fetchUser } from '@/app/fetchFunction/fetching'
import { TriggerContext } from '@/app/context/triggerContext';


const Sidebar = () => {

  const pathname = usePathname();


  const [openSidebar,setOpenSidebar]=useState(false);
  const [userDetails,setUserDetails]=useState(null);
  const [apiLimit,setApiLimit] =useState(0)
  const {apiLimitContext}=useContext(TriggerContext)
  const [subscribed,setSubscribed]=useState(false)
  
  const user=useSession()
  const fetchSession=async()=>{
    setUserDetails(await fetchUser(user.data.user.email))
   
}
useEffect(()=>{
  if(user.status=='authenticated')
 fetchSession()
 
 
 

},[user.status,apiLimitContext])

useEffect(()=>{
  if(userDetails){
    setApiLimit(userDetails.user.api_limit)
    setSubscribed(userDetails.user.subscribed)
    console.log('triggered')
  }
},[userDetails,apiLimitContext])

  
  return (
    <div className='h-screen '>

    
    <div className={`h-full  bg-slate-900 shadow-lg shadow-slate-950  transition-all relative duration-[0.1s] z-50 ease-in  ${openSidebar ? 'w-screen  md:w-64 xl:w-72 ':'w-0 md:w-28'}`}>

      <div className={`absolute  -right-4 ${openSidebar && 'right-1 rotate-180 md:-right-4 md:rotate-0'} z-50 mt-64    bg-slate-950 h-[10%] rounded-tr-2xl rounded-br-2xl cursor-pointer flex items-center justify-center group`} onClick={()=>setOpenSidebar(open=>!open)}>
      <AiFillCaretRight className={` ${openSidebar && 'md:rotate-180 '} group-hover:opacity-80 text-orange-200 `} />
      </div>
      
      <div className='w-full'>
      <Profile open={openSidebar} />
      </div>
      <div className={` py-5 flex flex-col ${!openSidebar ? 'items-center':'px-5 items-start'} gap-6   `}>
      { tools.map(tool=>(
        <Link key={tool.id} href={tool.link} className={`flex gap-5 items-center
           ${pathname===tool.link ?'':'hover:opacity-80'} cursor-pointer group relative `} onClick={()=>{setOpenSidebar(false)}}>
          <div  className={`text-3xl p-4 transition-all duration-100   rounded-full   w-[60px] ${!openSidebar && ' hidden md:block'} ${pathname===tool.link ? ` bg-gradient-to-tr from-red-400 ${tool.color} `:'bg-slate-700 group-hover:shadow-md  group-hover:shadow-red-200'}`}>
          {tool.icon}
          </div>
          
          {openSidebar && 
          <m.p 
          
          initial={{opacity:0}}
          animate={{opacity:1}}
         transition={{duration:1,delay:0.2}}

          className={` ${!openSidebar ? 'hidden scale-0 ' : 'block   scale-100 transition-all duration-300 '} `
          
        }
          
          
          >{tool.title}</m.p>
      }
          </Link>
      ))}
      {userDetails && !subscribed ? <div className={`w-full gap-5 flex items-center  px-5 ${!openSidebar&& 'hidden md:block'}`}>
        {openSidebar && <p>Free tier usage :</p>}
          
          <p className=' py-1 bg-slate-950 rounded-full  font-bold px-5'>{apiLimit} / 5</p>
        </div>  :userDetails && subscribed&&
         <div className={`w-full gap-5 flex items-center bg-slate-950 p-3 justify-between px-5 ${!openSidebar&& 'hidden md:block'}`}>
         {openSidebar && <p>Subscribed member </p>}
         <div className='px-[25px] py-3 rounded-full text-xl bg-yellow-600 '><FaCrown/> </div></div>}
      </div>
      
      </div>
    {openSidebar && <div className='bg-slate-800 bg-opacity-40 backdrop-blur-sm backdrop-filter top-0 w-screen   h-screen  z-30 fixed'></div>}
      
    </div>
  )
}

export default Sidebar
