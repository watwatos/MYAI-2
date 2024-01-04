'use client'
import { Loader } from '@/app/components/Loader'
import DashboardImage from '@/app/components/dashboard/DashboardImage'
import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import {BsArrowRight,BsDownload} from 'react-icons/bs'
import Input from '../routes/Input'
import { useSession } from 'next-auth/react'
import { fetchUser, webUrl } from '@/app/fetchFunction/fetching'

const ImageBody = () => {
  const [input,setInput]=useState("");
  const [image,setImage]=useState("");
  const [loading,setLoading]=useState(false);
  const [userDetails,setUserDetails]=useState(null);
  const [trigger,setTrigger]=useState(false)
  const [tokens,setTokens]=useState(0)

  const user=useSession()
  const fetchSession=async()=>{
      setUserDetails(await fetchUser(user.data.user.email))
     setTrigger(true)
  }
  const generateImage=async(prompt)=>{

    try {
      setLoading(true);
      const res = await fetch(`/api/image`
      ,{method:"POST",headers:{'Content-Type': 'application/json',},body:JSON.stringify(prompt)}
      
      
      )
      
     if(res.ok){
      console.log('okay')
      const data = await res.json()
      console.log(data)
      setTokens(t=>t+26666)
      setImage(data)
      
     }
     
    } catch (error) {
      console.log(error)
    }
    setInput("")
    setLoading(false)
  }

 const resetImage=()=>{
  setImage("");
  setInput("")
 }

 useEffect(()=>{
  if(user.status=='authenticated')
 fetchSession()
 
 

},[user.status])

 useEffect(()=>{
  if(userDetails)
  setTokens(userDetails.user.tokens_used)
},[trigger])

useEffect(()=>{
  if(userDetails)
  editTokens(tokens,userDetails.user._id)
},[tokens])



const editTokens = async(tokens,id)=>{
  console.log(JSON.stringify({"tokens_used":tokens}))
  
    try {
      const res = await fetch(`${webUrl}/api/users?id=${id}`,{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify({"tokens_used":tokens})})
     console.log(await res.json())
      if(res.ok){
        
        
      }
    } catch (error) {
      console.log(error)
    }
   
  

  
}
console.log(tokens)

  return (
   

     
      
      
      <div className='w-full flex flex-col items-center gap-5  '> 
      <Input toColor={"to-purple-600"} input={input} loading={loading} method={generateImage} placeholder={"A house in the woods"} setInput={setInput}/>
      


     {loading ?<div className='-z-10'  ><Loader/></div> :

      image? 
      
      
      <div className="flex flex-col items-center  gap-5">
        <div className='relative mt-20 md:mt-0  w-[250px] h-[250px] md:w-[350px] md:h-[350px] -z-20'>
      <Image  loader={() => image} src={image} fill alt='' className='z-0 rounded-[30%]'/>
      
      </div>
      <button className='p-2 px-6 flex gap-1 bg-slate-600  rounded-full hover:opacity-90' onClick={()=>window.open(image)}>Download <BsDownload/></button>
      <button className="p-2 px-4 bg-pink-600/10  rounded-full hover:opacity-90 " onClick={resetImage}> Generate another</button>
      </div>
      

      
      : 
        <div className='-z-10'><DashboardImage/></div>
      
      
      
    }
      

    </div>
  )
}

export default ImageBody
