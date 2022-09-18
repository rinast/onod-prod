import React from 'react'
import { IoIosCloseCircle } from "react-icons/io"
import { useNavigate } from 'react-router-dom'

export default function Close() {
  const navigate = useNavigate();
  function clicked() {
    navigate("/");
  }

  return (
    <>
      <IoIosCloseCircle onClick={clicked} className="icon-font"/>
    </>
  )
}
